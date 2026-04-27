# Design: KYC document storage migration (item #8)

Status: PROPOSED — needs review before implementation. Touches PII; merge with care.

## Problem

`kyc_documents.data` (TEXT, nullable) currently stores ID/passport/proof-of-residence images as base64-encoded strings. Three issues:

1. **Storage cost & D1 row size.** D1 isn't designed for blob payloads. Anything beyond a few hundred KB of base64 makes single-row reads slow and inflates the migration footprint.
2. **No encryption at rest beyond Cloudflare's default disk encryption.** Most jurisdictions require ID images to be access-controlled and audited; today any read of a row exposes them.
3. **No signed/time-limited access.** Any frontend page that fetches the row receives the full base64; there is no way to grant a manager a 5-minute view link.

## Proposed shape

Move the bytes to R2 (we already have `UPLOADS` binding in `wrangler.toml`); keep the metadata row in D1. R2 keys are namespaced by tenant + KYC case + document type to keep multi-tenant isolation clean and auditable.

### Schema delta

```sql
ALTER TABLE kyc_documents ADD COLUMN r2_key TEXT;
ALTER TABLE kyc_documents ADD COLUMN content_type TEXT;
ALTER TABLE kyc_documents ADD COLUMN size_bytes INTEGER;
ALTER TABLE kyc_documents ADD COLUMN sha256 TEXT;
-- `data` column stays for backward compat during the migration window; new writes leave it NULL.
CREATE INDEX idx_kyc_docs_tenant_case ON kyc_documents(tenant_id, kyc_case_id);
```

### R2 key convention

```
kyc/{tenant_id}/{kyc_case_id}/{document_type}-{uuid}.{ext}
```

`document_type` enumerated (`id_front`, `id_back`, `passport`, `proof_of_address`, `selfie`, `other`); `ext` derived from `content_type` (`.jpg`, `.png`, `.pdf`).

### Endpoints

- `POST /kyc/cases/:id/documents` — multipart upload. Validates content-type whitelist (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`), max 10 MB. Streams to R2, computes sha256, inserts the metadata row. Returns the doc id and a short-lived view URL.
- `GET /kyc/documents/:id/url` — returns a freshly-signed URL with TTL ≤ 10 minutes. Validates the requester has KYC-review permission. Logs the access in `audit_log`.
- `GET /kyc/documents/:id/download` (optional) — direct stream from R2 for backoffice tools that can't follow a signed URL. Same permission check.

The R2 bucket itself stays private; reads always go through the Worker so we can authenticate.

### Migration of existing data

A one-shot endpoint `POST /admin/kyc-documents/migrate-to-r2`, admin-only, batched at 20 rows per call:

1. Read up to 20 rows where `r2_key IS NULL AND data IS NOT NULL`.
2. For each row, decode the base64, infer content-type from the magic bytes (don't trust any stored content-type), validate size and type.
3. Upload to R2 with the canonical key.
4. Update the row: set `r2_key`, `content_type`, `size_bytes`, `sha256`; **do not** clear `data` yet — keep it for one week as a rollback safety net.
5. Return `{ migrated, remaining }` so the admin UI can poll.

A second endpoint `POST /admin/kyc-documents/finalize-migration` (run after the safety window) sets `data = NULL` for all rows where `r2_key IS NOT NULL` and sha256 matches a fresh recompute from R2.

### Frontend changes

`KYCDocumentsPage` / `KYCCaseDetail` swap inline base64 `<img>` tags for fetches against `GET /kyc/documents/:id/url`, then render the signed URL in an `<img>` (or `<a>` for PDFs). Cache the signed URL only for the page lifetime.

## Out of scope

- Field-level encryption inside R2 (Cloudflare-managed encryption is sufficient for v1).
- Document OCR / liveness detection.
- Customer-facing direct-upload links.

## Risk

- Migration is the riskiest part. The `data` column can contain malformed base64 from old buggy uploads — handle decode errors gracefully and mark such rows `MIGRATION_FAILED` instead of bulk-failing the batch.
- R2 key collisions are theoretically possible if two uploads land in the same millisecond with the same UUID — vanishingly unlikely but the upload handler should `bucket.head` first and retry on conflict.
- Audit-log volume will spike as every KYC view is logged. Sample at 1× initially; add rate-limiting if needed later.

## Estimated effort

1.5 days backend + 0.5 day frontend + 1 day migration + soak.
