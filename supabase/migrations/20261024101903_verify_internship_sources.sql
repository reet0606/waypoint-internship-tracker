/*
# Verify internship sources and separate live openings from sample data

1. Modified Tables
- `internships`
  - `is_verified` (boolean, not null, default false) marks whether the opening was checked against a real external listing.
  - `source_url` (text) stores the exact source page used for verification.

2. Data behavior
- Existing seeded sample rows remain stored for safe rollback, but are marked unverified and must not be shown publicly.
- Only explicitly verified rows should be displayed by the frontend.

3. Security
- Existing public SELECT access and RLS policy remain unchanged.
- No write access is added for anonymous users.
*/

ALTER TABLE internships
  ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;

ALTER TABLE internships
  ADD COLUMN IF NOT EXISTS source_url text;

CREATE INDEX IF NOT EXISTS internships_verified_posted_idx
  ON internships (is_verified, posted_days_ago, created_at DESC);
