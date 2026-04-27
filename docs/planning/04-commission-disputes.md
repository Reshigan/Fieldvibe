# Design: Commission disputes & reversals (item #4)

Status: PROPOSED — needs review before implementation. **Soft-blocked on item #3** if you want reversals to flow through the payment ledger; otherwise can ship independently.

## Problem

`commission_earnings` today supports a binary lifecycle: `PENDING -> APPROVED` (via `PUT /commission-earnings/:id/approve`) or `PENDING -> REJECTED`. Once approved, the only way to undo it is a DB edit. There is no:

- reason capture on rejection (stored as a nullable column? need to verify),
- dispute state where an agent contests an earning before the manager decides,
- reversal flow that preserves the original earning as a history row instead of mutating it,
- audit trail beyond `approved_by` / `approved_at`.

Approval today auto-creates a `commission_earnings` row on every sales-order INSERT (handler ~`workers-api/src/index.js:3563`, `:5951`, `:10569`). If the underlying order is later voided, refunded, or has its commission rule changed, the earning sits there approved and waiting to be paid. This is the leak.

## Proposed shape

### Schema additions

```sql
ALTER TABLE commission_earnings ADD COLUMN dispute_reason TEXT;
ALTER TABLE commission_earnings ADD COLUMN disputed_by TEXT;       -- FK users(id)
ALTER TABLE commission_earnings ADD COLUMN disputed_at TEXT;
ALTER TABLE commission_earnings ADD COLUMN reversed_by TEXT;       -- FK users(id)
ALTER TABLE commission_earnings ADD COLUMN reversed_at TEXT;
ALTER TABLE commission_earnings ADD COLUMN reversal_of TEXT;       -- self-reference: earnings.id this row reverses
ALTER TABLE commission_earnings ADD COLUMN rejection_reason TEXT;
```

Status enum widens: `PENDING | DISPUTED | APPROVED | REJECTED | REVERSED | PAID`.

### State machine

```
PENDING --(agent disputes)--> DISPUTED --(manager rules)--> APPROVED | REJECTED
PENDING --(manager)--> APPROVED | REJECTED
APPROVED --(manager reverses)--> REVERSED  (creates a new negative-amount row with reversal_of set)
APPROVED --(payout)--> PAID  (terminal; reversal still possible but generates a clawback)
```

Rejection: must set `rejection_reason`. Dispute: must set `dispute_reason`. Reversal: creates a sibling row with `commission_amount = -original.commission_amount`, `status = REVERSED`, `reversal_of = original.id`. Original row's status is also flipped to `REVERSED` and `reversed_by/reversed_at` populated.

If item #3 is in, post a matching `payment_ledger` entry of `entry_type=WRITE_OFF` for the clawback so the total commission liability on the books matches the ledger.

### New endpoints

- `POST /commission-earnings/:id/dispute` — agent only. Body: `{ reason }`. Refuses if status != PENDING.
- `POST /commission-earnings/:id/reverse` — admin/manager only. Body: `{ reason }`. Refuses if status != APPROVED and != PAID. Creates the sibling row in a `db.batch`.
- `PUT /commission-earnings/:id/reject` (rename existing if needed) — must accept `{ reason }`, store as `rejection_reason`.
- Existing `POST /commission-earnings/:id/approve` — extend to allow approving from DISPUTED.

### Auto-reversal on order events

Hook into:
- order-cancel handler: any APPROVED earnings tied to that order become reversed automatically with `reason = 'Order cancelled'`.
- credit-note application against an invoice: if the credit fully cancels the invoice, reverse proportionally; if partial, reverse partial. This is the trickiest bit — needs a single helper function `reverseCommissionFor(orderId, fraction)` shared by both call sites.

## UI

Frontend at `frontend/src/pages/commissions/CommissionApprovalPage.tsx` already exists; add:
- "Dispute" button visible to the agent who owns the row, shown only when `status === 'pending'`.
- Reason modal on Reject and Reverse.
- A new "Reversed" tab/filter, plus a "Reversal history" section in `CommissionDashboardPage` showing reversal volume per period (this is what finance will ask for).

## Migration

`0005_commission_disputes.sql` — pure ALTER ADD COLUMNs, all nullable defaults; no backfill needed because existing rows are all genuinely undisputed.

## Out of scope on first pass

- Multi-step approval (team lead -> regional manager). Single-tier approve is fine for now.
- Disputes with attached evidence files. Free-text reason only.

## Risk

- Backfill on the trigger paths (order-cancel, credit-note) needs careful query-by-`order_id` lookup against `commission_earnings`. Today many of those inserts don't store `order_id` consistently — verify and add an index `(tenant_id, order_id)` on `commission_earnings` as part of the migration.
- "Reversal of a PAID earning" requires a payout adjustment workflow — leave behind a flag in `commission_payouts` that finance has to clear manually for now; document in this file when shipping.

## Estimated effort

2 days backend + 1.5 days frontend.
