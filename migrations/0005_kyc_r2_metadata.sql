-- Add R2 storage metadata to kyc_documents.
-- The table already had r2_key/r2_url; this adds the content-type/integrity/uploader fields
-- the new R2 upload handler writes.
ALTER TABLE kyc_documents ADD COLUMN content_type TEXT;
ALTER TABLE kyc_documents ADD COLUMN sha256 TEXT;
ALTER TABLE kyc_documents ADD COLUMN uploaded_by TEXT;
CREATE INDEX IF NOT EXISTS idx_kyc_docs_case ON kyc_documents(tenant_id, kyc_case_id);
