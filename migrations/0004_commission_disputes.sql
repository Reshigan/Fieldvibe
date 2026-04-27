-- Commission disputes & reversals (item #4 of post-audit buildout).
-- All additive; existing rows untouched. New columns nullable so legacy code paths keep working.
ALTER TABLE commission_earnings ADD COLUMN dispute_reason TEXT;
ALTER TABLE commission_earnings ADD COLUMN disputed_by TEXT;
ALTER TABLE commission_earnings ADD COLUMN disputed_at TEXT;
ALTER TABLE commission_earnings ADD COLUMN rejection_reason TEXT;
ALTER TABLE commission_earnings ADD COLUMN reversal_reason TEXT;
ALTER TABLE commission_earnings ADD COLUMN reversed_by TEXT;
ALTER TABLE commission_earnings ADD COLUMN reversed_at TEXT;
ALTER TABLE commission_earnings ADD COLUMN reversal_of TEXT;
-- Speed up the auto-reversal lookup on order cancel.
CREATE INDEX IF NOT EXISTS idx_commission_earnings_source ON commission_earnings(tenant_id, source_id);
