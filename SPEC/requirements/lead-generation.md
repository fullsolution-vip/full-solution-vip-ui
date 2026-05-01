# Lead Generation Requirements

## Overview
Capture B2B leads from retailers interested in stocking Full Solution products.
High priority for revenue growth.

## Features

### 1. Trade Account Application Form
- **Route:** `/wholesale/apply` (new page)
- **Fields:** Company name, registration number, contact person, email, phone,
  current suppliers, product interests (checkboxes), estimated monthly volume, message
- **Submission:** Stores lead in Supabase `leads` table
- **Notification:** Email alert to `robbie@fullsolution.vip`
- **Acceptance:**
  - [ ] Form renders with all required fields
  - [ ] Form validation on all required fields
  - [ ] Successful submission shows thank-you message
  - [ ] Lead stored in Supabase with timestamp
  - [ ] Email notification sent

### 2. Sample Request CTA
- **Location:** Floating bar on `/wholesale`, `/products` pages
- **Action:** Opens sample request form (mini form: name, email, product interest)
- **Acceptance:**
  - [ ] Floating CTA appears after 5s or scroll 50%
  - [ ] Mini form submits to `leads` table with type="sample_request"
  - [ ] Confirmation message shown

### 3. Trade Catalogue Download
- **Location:** `/wholesale` page, exit-intent popup
- **Action:** "Download 2026 Catalogue (PDF)" in exchange for email
- **Acceptance:**
  - [ ] Email capture form (just email + company)
  - [ ] Email stored in `leads` table with type="catalogue_download"
  - [ ] PDF downloads automatically after submit
  - [ ] Exit-intent popup appears only once per session

### 4. Lead Dashboard (Admin)
- **Route:** `/admin/leads` (new admin section)
- **Data:** `leads` table
- **Actions:** View all leads, filter by type, mark as contacted, export to CSV
- **Acceptance:**
  - [ ] Lists all leads with date, type, company, email
  - [ ] Filter by lead type (application, sample, catalogue)
  - [ ] Mark lead as "contacted" / "converted"
  - [ ] Export leads to CSV

## Database Schema

```sql
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('application', 'sample_request', 'catalogue_download')),
  company_name TEXT,
  registration_number TEXT,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  product_interests TEXT[], -- Array of product categories
  estimated_volume TEXT,
  current_suppliers TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Only service role can access
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON leads FOR ALL TO service_role USING (true);
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/leads` | POST | Submit a lead (public) |
| `/api/leads` | GET | List leads (admin only) |
| `/api/leads/:id` | PATCH | Update lead status |

## Environment Variables

```
LEAD_NOTIFICATION_EMAIL=robbie@fullsolution.vip
CATALOGUE_PDF_URL=https://.../full-solution-2026-catalogue.pdf
```

## Test Coverage

| Test | File | Status |
|------|------|--------|
| Trade application submits | `test-automation/playwright/tests/leads.spec.ts` | [ ] |
| Sample request submits | `test-automation/playwright/tests/leads.spec.ts` | [ ] |
| Catalogue download captures email | `test-automation/playwright/tests/leads.spec.ts` | [ ] |
| Leads API stores data | `src/test/leads.test.ts` | [ ] |
