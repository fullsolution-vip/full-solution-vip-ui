# Chatbot Requirements

## Overview
AI-powered chatbot using RAG (Retrieval-Augmented Generation) with:
- **LLM:** Hugging Face Inference API (Mistral-7B / DeepSeek-V4)
- **Vector DB:** Supabase pgvector
- **Embeddings:** Hugging Face API
- **Cache:** Redis (langcache) for responses + embeddings

## Features

### 1. Chat Interface
- **Route:** `/chat` (public page) + floating `ChatWidget` (all pages)
- **API:** `POST /api/chat` with `{ message, sessionId }`
- **Acceptance:**
  - [x] User can type message and receive AI response
  - [x] Chat history displays user + assistant messages
  - [x] "Thinking..." indicator shows while processing
  - [ ] Session persists across page reloads (cookie/localStorage)
  - [ ] Streaming responses (currently HTTP, not WebSocket)

### 2. Knowledge Base (RAG)
- **Source:** Markdown files in `SPEC/knowledge-base/`
- **Processing:** `lib/chatbot/knowledge-loader.ts` → chunks → embeddings → Supabase
- **Retrieval:** Vector similarity search via `match_knowledge()` Supabase function
- **API:** `POST /api/chatbot-init?force=true` to re-index
- **Acceptance:**
  - [x] Knowledge base initializes on first request
  - [x] Only new/changed files processed (incremental)
  - [x] Similarity search returns relevant chunks
  - [ ] Knowledge base API endpoint to list/view chunks
  - [ ] Admin can upload new knowledge files via `/admin`

### 3. Chat Sessions & History
- **Tables:** `chatbot_sessions`, `chatbot_messages`
- **Session tracking:** `sessionId` stored in cookie or generated per session
- **Client Portal:** `/portal` shows chat history by session
- **Acceptance:**
  - [x] Messages stored in Supabase with session_id
  - [x] Client portal lists user's chat sessions
  - [x] Clicking a session shows full message history
  - [ ] Sessions linked to `auth.users.id` (currently nullable)
  - [ ] User can delete chat sessions from portal

### 4. Caching
- **Response cache:** Redis key `response:{sessionId}:{messageHash}` TTL 1800s
- **Message cache:** Redis key `messages:{sessionId}` TTL 300s
- **Acceptance:**
  - [x] Identical messages return cached response
  - [x] Cache hit logged in `logs/chatbot.log`
  - [ ] Cache stats visible in admin panel
  - [ ] Cache invalidation on knowledge base update

## Database Schema

```sql
-- Sessions
chatbot_sessions: id (UUID), session_id (TEXT UNIQUE), user_id (UUID→auth.users), created_at, updated_at

-- Messages
chatbot_messages: id (UUID), session_id (TEXT→chatbot_sessions), role, content, metadata (JSONB), created_at

-- Knowledge Base
chatbot_knowledge_base: id (UUID), content, content_hash (UNIQUE), embedding (VECTOR(384)), source_file, chunk_index, metadata (JSONB), created_at

-- Vector search function
match_knowledge(query_embedding, match_threshold, match_count) → table(id, content, source_file, similarity, metadata)
```

## Environment Variables

```
HUGGINGFACE_API_KEY=hf_...
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models/...
REDIS_URL=redis://... (or)
LANGCACHE_URL=https://... (langcache)
LANGCACHE_API_KEY=...
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send message, get AI response |
| `/api/chatbot-init` | POST | Initialize/re-index knowledge base |
| `/api/health` | GET | Check system health |

## Test Coverage

| Test | File | Status |
|------|------|--------|
| Embedding generation | `src/test/chatbot.test.ts` | [x] |
| Knowledge base retrieval | `src/test/chatbot.test.ts` | [x] |
| Chat service RAG flow | `src/test/chatbot.test.ts` | [x] |
| Text chunking | `src/test/chatbot.test.ts` | [x] |
| E2E chat flow | `test-automation/playwright/tests/chatbot.spec.ts` | [ ] |
| E2E chat history | `test-automation/playwright/tests/chatbot.spec.ts` | [ ] |
