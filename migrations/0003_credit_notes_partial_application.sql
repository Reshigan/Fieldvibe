-- Track partial application of credit notes against orders.
-- Existing rows: applied_amount=0 (none used), remaining_balance defaults to amount via app code on first read.
ALTER TABLE credit_notes ADD COLUMN applied_amount REAL DEFAULT 0;
ALTER TABLE credit_notes ADD COLUMN remaining_balance REAL;
-- Backfill remaining_balance for rows that already exist:
--   FULLY_APPLIED rows -> 0; everything else -> amount.
UPDATE credit_notes SET remaining_balance = 0 WHERE status = 'FULLY_APPLIED';
UPDATE credit_notes SET remaining_balance = amount WHERE remaining_balance IS NULL;
