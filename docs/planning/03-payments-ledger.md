# Design: Payments ledger & reversals (item #3)

Status: PROPOSED — needs review before implementation.

## Problem

`payments` today is a single flat row per receipt (`amount`, `method`, `reference`, `status`). The handler at `workers-api/src/index.js:5011` updates `sales_orders.payment_status` to PAID/PARTIAL by summing the payments table, but:

- There is no general ledger / double-entry view, so reconciling against bank statements requires ad-hoc SQL.
- There is no reversal flow — to refund a payment you have to insert a "negative" row, but the handler does not allow negative `amount` and the `payment_status` re-derivation does not consider reversals as separate from refunds.
- There is no multi-currency support (an FX gain/loss column is not present).
- There is no separation between "received" (cash/EFT received) and "applied" (credited to a specific invoice). The current code conflates them: the moment a payment row exists it is treated as applied to the linked order.

This blocks credit-note application from being symmetric with cash receipts (item #2 sidesteps it by writing a `payments` row of method `CREDIT_NOTE`), blocks proper unallocated-cash handling, and blocks audit-grade financial reporting.

## Proposed shape

Two new tables, no destructive changes to existing ones.

### Table `payment_ledger`

Append-only journal of every money movement. **Never** updated or deleted; reversals are new rows.

```sql
CREATE TABLE payment_ledger (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  payment_id TEXT NOT NULL,                  -- receipt this entry belongs to
  sales_order_id TEXT,                        -- nullable: unallocated receipts have NULL until applied
  entry_type TEXT NOT NULL,                   -- RECEIPT | APPLICATION | REVERSAL | FX_ADJUSTMENT | WRITE_OFF
  direction TEXT NOT NULL,                    -- DEBIT | CREDIT
  amount REAL NOT NULL,                       -- always positive; direction encodes the sign
  currency TEXT NOT NULL DEFAULT 'ZAR',
  fx_rate REAL DEFAULT 1.0,                   -- to tenant base currency
  reversal_of TEXT,                           -- payment_ledger.id this row reverses (NULL otherwise)
  notes TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (payment_id) REFERENCES payments(id),
  FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id),
  FOREIGN KEY (reversal_of) REFERENCES payment_ledger(id)
);
CREATE INDEX idx_pl_tenant_order ON payment_ledger(tenant_id, sales_order_id);
CREATE INDEX idx_pl_tenant_payment ON payment_ledger(tenant_id, payment_id);
CREATE INDEX idx_pl_reversal ON payment_ledger(reversal_of);
```

### Table `payment_applications` (optional materialised view)

Convenience denormalisation of the ledger for fast "what is this order's outstanding" lookups. Maintained inside the `db.batch` that writes the ledger, never edited otherwise.

```sql
CREATE TABLE payment_applications (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  payment_id TEXT NOT NULL,
  sales_order_id TEXT NOT NULL,
  amount_applied REAL NOT NULL,               -- net of reversals
  currency TEXT NOT NULL DEFAULT 'ZAR',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (payment_id, sales_order_id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (payment_id) REFERENCES payments(id),
  FOREIGN KEY (sales_order_id) REFERENCES sales_orders(id)
);
CREATE INDEX idx_pa_tenant_order ON payment_applications(tenant_id, sales_order_id);
```

If we skip this table, every order outstanding lookup is `SUM(direction='CREDIT') - SUM(direction='DEBIT')` over `payment_ledger`. That's fine for D1 at this scale; only add the table if a profiler shows it.

## Handler changes

- `POST /sales/payments` (currently the simple row insert) becomes:
  1. Insert `payments` row for the receipt header (no longer the source of truth for amount applied).
  2. Insert one `payment_ledger` row of `entry_type=RECEIPT, direction=CREDIT` for the gross amount.
  3. If `sales_order_id` provided, also insert `entry_type=APPLICATION, direction=CREDIT` against that order; otherwise leave unallocated.
  4. Re-derive `sales_orders.payment_status` from the ledger (`SUM(amount) FILTER (direction='CREDIT' AND entry_type='APPLICATION') - SUM(amount) FILTER (direction='DEBIT')`).
- `POST /sales/payments/:id/apply` (NEW): apply an unallocated receipt to one or more orders. Creates one `APPLICATION` row per (payment, order). Refuses if total applied would exceed receipt amount.
- `POST /sales/payments/:id/reverse` (NEW): admin/manager only. Inserts a `REVERSAL` row referencing the original ledger entry (not the receipt). Re-derives `payment_status` of every affected order. Won't reverse a row that already has a reversal.
- `GET /sales/payments/:id/ledger` (NEW): the audit trail for a single receipt.

## Migration & backfill

- One forward migration `0004_payment_ledger.sql`.
- Backfill: for every existing `payments` row, insert a synthetic `RECEIPT+APPLICATION` pair so historical orders' `payment_status` re-derivation matches their current value. Do this in the migration as a one-off `INSERT INTO payment_ledger SELECT ... FROM payments` so deploy-time math is conservative.

## Out of scope on first pass

- Bank reconciliation feed import.
- Multi-currency revaluation cron.
- Customer statement PDFs.

## Risk

- The handler change is a behavioural change for anything that reads `payments.amount` directly. Audit consumers first: `grep -n "FROM payments" workers-api/src/index.js` shows ~20 hits — most are sums and will keep working; flag any that read a single row's `amount` and treat it as "applied to order" — those need to read the application total instead.
- `db.batch` keeps the ledger and the orders update in one transaction. Don't split.

## Estimated effort

3 days backend + 1 day frontend (payments list shows ledger, plus reversal action behind a confirm dialog).
