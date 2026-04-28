#!/bin/bash

# Deploy to Vercel script
set -e

echo "🚀 Starting deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm i -g vercel
fi

# Pull environment variables if needed
echo "📥 Pulling environment variables..."
vercel env pull .env.production 2>/dev/null || true

# Deploy to Vercel
echo "📤 Deploying to Vercel..."
vercel --prod --yes

echo "✅ Deployment complete!"
echo "🔗 Check your deployment at: https://full-solution-vip-ui.vercel.app"
