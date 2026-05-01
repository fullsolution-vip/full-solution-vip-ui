# Client Portal Requirements

## Overview
Authenticated user dashboard showing chat history, product queries, and account settings.
Route: `/portal` (protected, requires authentication)

## Features

### 1. Chat History
- **Route:** `/portal` → "Chat History" section
- **Data:** Fetched from `chatbot_sessions` + `chatbot_messages` (Supabase)
- **Grouping:** Sessions grouped by date, most recent first
- **Acceptance:**
  - [x] Lists all chat sessions for the logged-in user
  - [x] Shows session date, message count, preview
  - [x] Clicking a session shows full message thread
  - [ ] Sessions are filtered by `user_id` (currently not linked)
  - [ ] User can delete a session (and its messages)
  - [ ] Pagination for users with many sessions

### 2. Product Queries
- **Route:** `/portal` → "Product Queries" section
- **Data:** Derived from chat messages mentioning products
- **Acceptance:**
  - [ ] Shows products the user has asked about
  - [ ] Links to product pages
  - [ ] Tracks "saved" products for later viewing

### 3. Account Settings
- **Route:** `/portal` or `/account` settings tab
- **Fields:** Email (read-only), name, password change
- **Acceptance:**
  - [ ] User can update first/last name
  - [ ] User can change password
  - [ ] User can delete their account

## Database Queries

```sql
-- Get user's chat sessions
SELECT s.session_id, s.created_at, s.updated_at,
       COUNT(m.id) as message_count
FROM chatbot_sessions s
LEFT JOIN chatbot_messages m ON s.session_id = m.session_id
WHERE s.user_id = 'user-uuid'
GROUP BY s.session_id, s.created_at, s.updated_at
ORDER BY s.updated_at DESC;

-- Get messages for a session
SELECT role, content, created_at
FROM chatbot_messages
WHERE session_id = 'session-id'
ORDER BY created_at ASC;
```

## API Endpoints Needed

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/portal/sessions` | GET | List user's chat sessions |
| `/api/portal/sessions/:id` | GET | Get session messages |
| `/api/portal/sessions/:id` | DELETE | Delete a session |

## Test Coverage

| Test | File | Status |
|------|------|--------|
| Portal page loads | `test-automation/playwright/tests/portal.spec.ts` | [ ] |
| Chat history displays | `test-automation/playwright/tests/portal.spec.ts` | [ ] |
| Session messages view | `test-automation/playwright/tests/portal.spec.ts` | [ ] |
| Delete session | `test-automation/playwright/tests/portal.spec.ts` | [ ] |
