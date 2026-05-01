# Admin Portal Requirements

## Overview
Admin dashboard for managing users, knowledge base, and viewing system health.
Route: `/admin` (protected, requires `admin` role)

## Features

### 1. User Management
- **Route:** `/admin` → "Users" section
- **Data:** Supabase Auth `listUsers()` (requires service role key)
- **Actions:** View all users, toggle admin/client role, delete users
- **Acceptance:**
  - [x] Lists all registered users with email, role, created date
  - [x] Admin can promote user to admin role
  - [x] Admin can demote admin to client role
  - [ ] User role stored in `user_metadata.role`
  - [ ] Admin can delete users
  - [ ] Search/filter users by email

### 2. Knowledge Base Management
- **Route:** `/admin` → "Knowledge Base" section
- **Data:** `chatbot_knowledge_base` table
- **Actions:** View chunks, re-index (force reprocess), delete chunks
- **Acceptance:**
  - [x] Shows chunk count and status
  - [x] "Force Re-index" button triggers `/api/chatbot-init?force=true`
  - [ ] Lists all knowledge chunks with source file, preview
  - [ ] Admin can upload new knowledge `.md` files
  - [ ] Admin can delete individual chunks
  - [ ] Shows last indexing date

### 3. System Health
- **Route:** `/admin` → "Health" section (or separate page)
- **Data:** `/api/health` endpoint
- **Metrics:** Supabase status, Hugging Face status, Redis status
- **Acceptance:**
  - [ ] Shows live status of all services
  - [ ] Shows knowledge base stats (chunk count, last update)
  - [ ] Shows chat usage stats (total sessions, messages today)

### 4. Product Management (Future)
- **Route:** `/admin/products`
- **Data:** Products database table (not yet implemented)
- **Acceptance:**
  - [ ] CRUD operations for products
  - [ ] Bulk import/export
  - [ ] View products as they appear to retailers

## Database

Uses Supabase Auth admin API + existing `chatbot_knowledge_base` table.
No separate admin table needed — uses `user_metadata.role`.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/users` | GET | List all users (service role required) |
| `/api/admin/users/:id/role` | POST | Update user role |
| `/api/chatbot-init` | POST | Initialize/re-index knowledge base |
| `/api/admin/health` | GET | Detailed system health |
| `/api/admin/stats` | GET | Usage statistics |

## Test Coverage

| Test | File | Status |
|------|------|--------|
| Admin page loads | `test-automation/playwright/tests/admin.spec.ts` | [ ] |
| User role toggle | `test-automation/playwright/tests/admin.spec.ts` | [ ] |
| Re-index knowledge base | `test-automation/playwright/tests/admin.spec.ts` | [ ] |
| Non-admin blocked | `test-automation/playwright/tests/admin.spec.ts` | [ ] |
