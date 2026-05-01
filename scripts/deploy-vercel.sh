#!/bin/bash

# Full Solution - Vercel Deployment Script
# This script deploys your app to Vercel with all environment variables

set -e  # Exit on error

echo "🚀 Full Solution - Vercel Deployment"
echo "=================================="

# Check if vercel CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "   Please create it from .env.example:"
    echo "   cp .env.example .env"
    echo "   Then edit .env with your actual values"
    exit 1
fi

echo "✓ Found .env file"

# Read .env and prepare variables for Vercel
echo ""
echo "📋 Loading environment variables from .env..."

# Function to get value from .env
get_env_var() {
    grep "^$1=" .env | cut -d'=' -f2-
}

# Check required variables
check_var() {
    local value=$(get_env_var "$1")
    if [ -z "$value" ]; then
        echo "  ⚠️  $1 is not set in .env"
        return 1
    else
        echo "  ✓ $1 is set"
        return 0
    fi
}

echo ""
echo "Checking required variables:"
check_var "SUPABASE_URL"
check_var "SUPABASE_ANON_KEY"
check_var "SUPABASE_SERVICE_KEY"
check_var "RESEND_API_KEY"
check_var "HUGGINGFACE_API_KEY"
check_var "LANGCACHE_URL"
check_var "REDIS_URL"

echo ""
echo "🔑 Setting environment variables in Vercel..."

# Set all environment variables in Vercel
# This uses `vercel env add` which prompts for confirmation
# For non-interactive, we use the API directly, but `vercel env add` is safer

# Function to add env var to Vercel
add_vercel_env() {
    local var_name=$1
    local var_value=$(get_env_var "$var_name")
    
    if [ -z "$var_value" ]; then
        echo "  Skipping $var_name (not set)"
        return
    fi
    
    echo "  Adding $var_name..."
    # Remove existing and add new
    npx vercel env rm "$var_name" -y 2>/dev/null || true
    echo "$var_value" | npx vercel env add "$var_name" production 2>/dev/null || true
    echo "$var_value" | npx vercel env add "$var_name" preview 2>/dev/null || true
    echo "$var_value" | npx vercel env add "$var_name" development 2>/dev/null || true
}

# Add all environment variables
add_vercel_env "SUPABASE_URL"
add_vercel_env "SUPABASE_ANON_KEY"
add_vercel_env "SUPABASE_SERVICE_KEY"
add_vercel_env "RESEND_API_KEY"
add_vercel_env "FROM_EMAIL"
add_vercel_env "ADMIN_EMAIL"
add_vercel_env "HUGGINGFACE_API_KEY"
add_vercel_env "HUGGINGFACE_API_URL"
add_vercel_env "VITE_HUGGINGFACE_MODEL"
add_vercel_env "LANGCACHE_URL"
add_vercel_env "LANGCACHE_API_KEY"
add_vercel_env "LANGCACHE_ID"
add_vercel_env "REDIS_URL"
add_vercel_env "VITE_WHATSAPP_NUMBER"
add_vercel_env "VITE_APP_URL"
add_vercel_env "VITE_OAUTH_CALLBACK_URL"
add_vercel_env "JWT_SECRET"
add_vercel_env "DATABASE_URL"

echo ""
echo "🚀 Deploying to Vercel..."

# Deploy to production
npx vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Check your deployment at: https://full-solution-vip-ui.vercel.app"
echo "  2. Verify env vars: Go to Vercel Dashboard → Project → Settings → Environment Variables"
echo "  3. Test the API: https://full-solution-vip-ui.vercel.app/api-docs"
