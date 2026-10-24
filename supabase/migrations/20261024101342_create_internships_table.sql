/*
# Create internships table (single-tenant, no auth)

1. New Tables
- `internships` — stores all internship opportunities visible on the Discover page.
  - id (text, primary key — stable string id used by the frontend tracker)
  - title (text, not null)
  - company (text, not null)
  - logo_color (text) — hex color for the company logo tile
  - role (text, not null) — one of: Product Management, Software Development, Marketing, Business
  - location (text, not null) — "City, State" display string
  - state (text, not null) — Indian state name, used for the state filter
  - work_mode (text, not null) — one of: Remote, Hybrid, On-site
  - duration (text, not null) — human-readable duration
  - stipend (text, not null) — human-readable stipend string
  - posted_days_ago (integer, default 0)
  - deadline (text, not null) — application deadline display string
  - description (text, not null)
  - responsibilities (jsonb, not null) — array of strings
  - requirements (jsonb, not null) — array of strings
  - skills (jsonb, not null) — array of strings
  - openings (integer, default 1)
  - apply_url (text, not null) — external company application URL
  - created_at (timestamptz, default now())

2. Security
- Enable RLS on `internships`.
- Grant SELECT to `anon` + `authenticated` so the no-auth frontend can read all internships.
- No INSERT/UPDATE/DELETE grants for anon — internships are managed server-side.
- All four CRUD policies use `USING (true)` / `WITH CHECK (true)` for SELECT only because
  this is intentionally public/shared data (single-tenant, no sign-in app).

3. Notes
- The frontend reads this table via the anon key; only SELECT is exposed.
- Applications (Saved/Applied/Interview/Rejected) remain in browser localStorage since there is no auth.
*/

CREATE TABLE IF NOT EXISTS internships (
  id text PRIMARY KEY,
  title text NOT NULL,
  company text NOT NULL,
  logo_color text NOT NULL DEFAULT '#334155',
  role text NOT NULL CHECK (role IN ('Product Management','Software Development','Marketing','Business')),
  location text NOT NULL,
  state text NOT NULL,
  work_mode text NOT NULL CHECK (work_mode IN ('Remote','Hybrid','On-site')),
  duration text NOT NULL,
  stipend text NOT NULL,
  posted_days_ago integer NOT NULL DEFAULT 0,
  deadline text NOT NULL,
  description text NOT NULL,
  responsibilities jsonb NOT NULL DEFAULT '[]',
  requirements jsonb NOT NULL DEFAULT '[]',
  skills jsonb NOT NULL DEFAULT '[]',
  openings integer NOT NULL DEFAULT 1,
  apply_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE internships ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON internships TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_internships" ON internships;
CREATE POLICY "anon_select_internships"
ON internships FOR SELECT
TO anon, authenticated USING (true);
