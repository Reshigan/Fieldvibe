# Design: Van Sales schema + handler rebuild (item #5)

Status: PROPOSED — biggest item in the backlog. Read before any code is written.

## Problem

The audit found ~40 routes under `/van-sales/*` and ~13 frontend pages, but the schema is missing the tables those routes query: `van_loads`, `van_sales`, `van_load_items`. The cash-session endpoint at `workers-api/src/index.js:14693` returns rows from the `users` table, not cash sessions. Result: every Van Sales page either renders an empty array or 500s.

The rebuild is large because the data model is a real warehousing-and-cash domain, not a thin CRUD veneer. We need to model it correctly the first time or it will fight commissions, payments, and inventory forever.

## Domain model

A **van** is a mobile warehouse owned by an agent for a route or a day. The lifecycle:

1. **Load** — admin/manager allocates products from a fixed warehouse to the van. This decreases warehouse stock and creates a `van_load` record with line items.
2. **Departure** — agent confirms pickup; GPS + odometer + opening cash captured.
3. **Sales** — during the route, agent creates `sales_orders` of `order_type='direct_sale'` against customers; each line decrements `van_load_items.quantity_remaining`. Payments are received in cash/card/credit-note; cash receipts feed a running `cash_session` for the day.
4. **Returns** — partial returns from customers ride the existing `returns` flow but mark `via_van_load_id`.
5. **Reconciliation** — at end of day: agent counts cash + remaining product. The system computes the variance (expected vs. counted) per product and per cash. Manager approves or flags.
6. **Settlement** — approved variance creates inventory adjustments (`stock_adjustments` rows of `RETURN_IN`, `DAMAGE`, or `ADJUSTMENT_DOWN` for shrinkage) and a cash-deposit movement.

Each step writes to a real, audited table. None of it goes through `users`.

## Schema

```sql
-- A van is a physical asset; an agent_id can change daily.
CREATE TABLE vans (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  description TEXT,
  default_warehouse_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',                   -- active | maintenance | retired
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (default_warehouse_id) REFERENCES warehouses(id),
  UNIQUE (tenant_id, registration_number)
);

CREATE TABLE van_loads (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  van_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  load_date TEXT NOT NULL,                        -- ISO date the load is for
  status TEXT NOT NULL DEFAULT 'PLANNED',         -- PLANNED | LOADED | DEPARTED | RETURNED | RECONCILED | APPROVED
  opening_cash REAL DEFAULT 0,
  closing_cash REAL,
  expected_cash REAL,                             -- computed at reconcile
  cash_variance REAL,                             -- closing - expected
  start_odometer REAL,
  end_odometer REAL,
  start_gps_lat REAL, start_gps_lng REAL,
  end_gps_lat REAL,   end_gps_lng REAL,
  loaded_at TEXT, departed_at TEXT, returned_at TEXT, reconciled_at TEXT, approved_at TEXT,
  approved_by TEXT,
  notes TEXT,
  created_by TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (van_id) REFERENCES vans(id),
  FOREIGN KEY (agent_id) REFERENCES users(id),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
);
CREATE INDEX idx_vl_tenant_agent ON van_loads(tenant_id, agent_id, load_date);
CREATE INDEX idx_vl_status ON van_loads(tenant_id, status);

CREATE TABLE van_load_items (
  id TEXT PRIMARY KEY,
  van_load_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity_loaded INTEGER NOT NULL,
  quantity_sold INTEGER DEFAULT 0,                -- maintained from sales_orders
  quantity_returned_to_warehouse INTEGER DEFAULT 0,
  quantity_remaining INTEGER NOT NULL,            -- generated: loaded - sold - returned (kept as a column for query speed)
  unit_cost REAL,                                  -- snapshot from products at load-time for variance valuation
  FOREIGN KEY (van_load_id) REFERENCES van_loads(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE (van_load_id, product_id)
);

CREATE TABLE cash_sessions (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  van_load_id TEXT,                                -- nullable for non-van cash handling
  opened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  opening_amount REAL NOT NULL DEFAULT 0,
  closed_at TEXT,
  closing_amount REAL,
  expected_amount REAL,
  variance REAL,
  status TEXT DEFAULT 'OPEN',                      -- OPEN | CLOSED | APPROVED
  approved_by TEXT,
  notes TEXT,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  FOREIGN KEY (agent_id) REFERENCES users(id),
  FOREIGN KEY (van_load_id) REFERENCES van_loads(id)
);
CREATE INDEX idx_cs_tenant_status ON cash_sessions(tenant_id, status);

CREATE TABLE cash_session_lines (
  id TEXT PRIMARY KEY,
  cash_session_id TEXT NOT NULL,
  movement_type TEXT NOT NULL,                     -- RECEIPT | EXPENSE | DEPOSIT | OPENING | CLOSING_COUNT
  reference_type TEXT,                              -- SALES_ORDER | PAYMENT | EXPENSE
  reference_id TEXT,
  amount REAL NOT NULL,                             -- signed: + increases cash, - decreases
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cash_session_id) REFERENCES cash_sessions(id)
);
```

Tying back: `sales_orders.van_stock_load_id` already exists in the baseline (line 307) — it just was never enforced. After this rebuild, every `direct_sale` order from a van must carry it; we add a CHECK at the application layer (D1 doesn't enforce CHECK on UPDATE reliably).

## Handler rewrite plan (in order)

1. CRUD for `vans` (small).
2. `POST /van-loads` — create + auto-decrement warehouse stock via existing `stock_movements` (`TRANSFER_OUT`).
3. `POST /van-loads/:id/depart` and `/return` — state transitions.
4. Wire existing `POST /sales-orders` (and the field-ops `direct_sale` path used by Van Sales) to:
   - require `van_stock_load_id` when role=van-sales agent,
   - decrement `van_load_items.quantity_sold`,
   - append a `RECEIPT` row to the agent's open `cash_session` for the cash portion of the payment.
5. Cash session `open` / `close` / `approve` endpoints.
6. `POST /van-loads/:id/reconcile` — compute variance per product and per cash, persist on the load, return a diff document.
7. `POST /van-loads/:id/approve` — admin/manager only; creates `stock_adjustments` for any negative variance and a cash-deposit ledger row (or `payment_ledger` if item #3 is in).

## Backfill

If any van-sales rows exist in production today, none of them are correctly modelled — likely they're just `sales_orders` of `order_type='direct_sale'`. Strategy: leave history alone; new tables start empty; add a `legacy=1` flag on the create-from-load handler to skip enforcement during a one-week migration window so legacy orders can still be queried.

## What changes for the frontend

Major. The 13 existing pages reference fields that don't exist (e.g. cash-session showing user fields). They will all be rewritten against the new schema. Suggested order: van-loads list & detail, then cash-session, then reconciliation. Defer route-stops, expenses, performance pages to a second pass.

## Risk

- This will exceed a single Worker request timeout if any handler does N+1 queries over a 200-product van load. Use `db.batch` and aggregated SQL throughout.
- `quantity_remaining` as a stored column risks drift; consider dropping it and computing in queries, or guarding it behind a single helper that always recomputes from line totals.
- Cash math in `REAL` will accumulate rounding error over a long route. This is a candidate for the eventual REAL→INTEGER-cents migration noted in the audit; for now, round to cents on every read.

## Estimated effort

5–7 working days backend + 4–5 days frontend (only includes the must-have flows; everything beyond reconcile/approve is bonus).
