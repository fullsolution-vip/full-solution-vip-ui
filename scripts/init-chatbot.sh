#!/bin/bash

echo "🚀 Starting Full Solution chatbot initialization..."

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found"
    exit 1
fi

# Run knowledge base initialization
echo "📚 Initializing knowledge base..."
node -e "
const { initializeKnowledgeBase } = require('./dist/server/index.js').default || require('./dist/server/index.js');
initializeKnowledgeBase().then(() => {
  console.log('✅ Knowledge base ready');
  process.exit(0);
}).catch(err => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
"

echo "✅ Initialization complete!"
