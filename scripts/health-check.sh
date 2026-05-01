#!/bin/bash

# Health Check Script - Tests all external service connections
# Usage: npm run health-check

echo "🏥 Full Solution - Health Check"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "   Run: cp .env.example .env"
    exit 1
fi

echo "✓ Found .env file"
echo ""

# Function to get env var
get_env() {
    grep "^$1=" .env 2>/dev/null | cut -d'=' -f2- | tr -d '"' | tr -d "'"
}

# Test Supabase Connection
echo "📊 Testing Supabase Connection..."
SUPABASE_URL=$(get_env "SUPABASE_URL")
SUPABASE_KEY=$(get_env "SUPABASE_SERVICE_KEY")

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo -e "${RED}❌ Supabase URL or Key not set${NC}"
else
    # Test with curl
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        "$SUPABASE_URL/rest/v1/" \
        -H "apikey: $SUPABASE_KEY" \
        -H "Authorization: Bearer $SUPABASE_KEY" 2>/dev/null)
    
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "401" ]; then
        echo -e "${GREEN}✓ Supabase connection successful${NC}"
    else
        echo -e "${RED}❌ Supabase connection failed (HTTP: $RESPONSE)${NC}"
    fi
fi
echo ""

# Test Redis/Langcache Connection
echo "🔴 Testing Redis/Langcache Connection..."
LANGCACHE_URL=$(get_env "LANGCACHE_URL")
REDIS_URL=$(get_env "REDIS_URL")

if [ -z "$LANGCACHE_URL" ] && [ -z "$REDIS_URL" ]; then
    echo -e "${YELLOW}⚠️  No Redis URL configured${NC}"
else
    # Try to connect with nc (netcat)
    if command -v nc &> /dev/null; then
        # Extract host and port
        if [ ! -z "$LANGCACHE_URL" ]; then
            # Parse redis:// URL
            HOST=$(echo "$LANGCACHE_URL" | sed -e 's|redis://.*@||' -e 's|:.*||')
            PORT=$(echo "$LANGCACHE_URL" | grep -o ':[0-9]*' | head -1 | tr -d ':')
            if [ -z "$PORT" ]; then PORT=6379; fi
        else
            HOST=$(echo "$REDIS_URL" | sed -e 's|redis://.*@||' -e 's|:.*||')
            PORT=$(echo "$REDIS_URL" | grep -o ':[0-9]*' | head -1 | tr -d ':')
            if [ -z "$PORT" ]; then PORT=6379; fi
        fi
        
        if nc -z -w 3 "$HOST" "$PORT" 2>/dev/null; then
            echo -e "${GREEN}✓ Redis server is reachable at $HOST:$PORT${NC}"
        else
            echo -e "${RED}❌ Cannot connect to Redis at $HOST:$PORT${NC}"
            echo "   Check if the Redis server is running and the URL is correct"
        fi
    else
        echo -e "${YELLOW}⚠️  Cannot test Redis (nc not installed)${NC}"
    fi
fi
echo ""

# Test Hugging Face API
echo "🤖 Testing Hugging Face API..."
HF_KEY=$(get_env "HUGGINGFACE_API_KEY")

if [ -z "$HF_KEY" ]; then
    echo -e "${RED}❌ Hugging Face API key not set${NC}"
else
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        "https://api-inference.huggingface.co/models" \
        -H "Authorization: Bearer $HF_KEY" 2>/dev/null)
    
    if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "401" ]; then
        echo -e "${GREEN}✓ Hugging Face API key is valid${NC}"
    else
        echo -e "${RED}❌ Hugging Face API test failed (HTTP: $RESPONSE)${NC}"
    fi
fi
echo ""

# Test Resend API
echo "📧 Testing Resend API..."
RESEND_KEY=$(get_env "RESEND_API_KEY")

if [ -z "$RESEND_KEY" ]; then
    echo -e "${RED}❌ Resend API key not set${NC}"
else
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        "https://api.resend.com/emails" \
        -H "Authorization: Bearer $RESEND_KEY" 2>/dev/null)
    
    if [ "$RESPONSE" = "401" ] || [ "$RESPONSE" = "403" ] || [ "$RESPONSE" = "400" ]; then
        echo -e "${GREEN}✓ Resend API key is valid${NC}"
    else
        echo -e "${YELLOW}⚠️  Resend API test inconclusive (HTTP: $RESPONSE)${NC}"
    fi
fi
echo ""

# Summary
echo "=================================="
echo "📋 Summary"
echo "=================================="
echo ""
echo "To fix ❌ errors:"
echo "  1. Check your .env file has the correct values"
echo "  2. For Supabase: Verify project is active"
echo "  3. For Redis: Check if the cloud instance is running"
echo "  4. For APIs: Verify API keys are correct and not expired"
echo ""
echo "For deployment to Vercel:"
echo "  npm run deploy-vercel"
