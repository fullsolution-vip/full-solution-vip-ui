-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Chat sessions table
CREATE TABLE IF NOT EXISTS chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES chatbot_sessions(session_id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base embeddings table
CREATE TABLE IF NOT EXISTS chatbot_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  content_hash TEXT UNIQUE NOT NULL,
  embedding VECTOR(384),
  source_file TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_knowledge_embedding 
ON chatbot_knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for content hash lookups
CREATE INDEX IF NOT EXISTS idx_knowledge_hash 
ON chatbot_knowledge_base(content_hash);

-- Create index for session lookups
CREATE INDEX IF NOT EXISTS idx_messages_session 
ON chatbot_messages(session_id, created_at);

-- Enable RLS
ALTER TABLE chatbot_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Policies for chatbot_sessions
CREATE POLICY "Allow public read access to sessions" 
ON chatbot_sessions FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert to sessions" 
ON chatbot_sessions FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

CREATE POLICY "Allow public update to sessions" 
ON chatbot_sessions FOR UPDATE 
TO anon, authenticated 
USING (true);

-- Policies for chatbot_messages
CREATE POLICY "Allow public read access to messages" 
ON chatbot_messages FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow public insert to messages" 
ON chatbot_messages FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Policies for chatbot_knowledge_base (read-only for public)
CREATE POLICY "Allow public read access to knowledge base" 
ON chatbot_knowledge_base FOR SELECT 
TO anon, authenticated 
USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_chatbot_sessions_updated_at 
BEFORE UPDATE ON chatbot_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function for similarity search
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding VECTOR(384),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  source_file TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.source_file,
    1 - (kb.embedding <=> query_embedding) AS similarity,
    kb.metadata
  FROM chatbot_knowledge_base kb
  WHERE 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
