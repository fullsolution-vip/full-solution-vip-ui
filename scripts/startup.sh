#!/bin/bash

echo "🚀 Initializing Full Solution chatbot..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "✅ Loaded .env file"
fi

# Run knowledge base initialization
echo "📚 Processing knowledge base..."
node -e "
const { initializeKnowledgeBase } = require('./src/lib/chatbot/knowledge-loader.ts');
initializeKnowledgeBase()
  .then(() => {
    console.log('✅ Knowledge base initialized successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed to initialize knowledge base:', err);
    process.exit(1);
  });
"

echo "✅ Startup complete!"
