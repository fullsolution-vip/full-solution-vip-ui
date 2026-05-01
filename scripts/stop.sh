#!/bin/bash

# Stop all Node.js processes related to this project
echo "Stopping development servers..."

# Kill all node processes (caution: this kills ALL node processes)
# For more precision, we can target specific ports
pkill -f "vite" 2>/dev/null || true
pkill -f "node.*vite" 2>/dev/null || true

# Alternative: Kill processes on specific ports
# lsof -ti:8080 | xargs kill -9 2>/dev/null || true

echo "All Node processes stopped."
echo "You can now run: npm run dev"
