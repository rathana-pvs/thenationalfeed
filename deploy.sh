#!/bin/bash
# deploy.sh — The National Feed VPS Deployment Script (PM2 + Nginx + Docker DB 5438)
set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying The National Feed (PM2 + Nginx)...${NC}"

# 1. Pull latest code
echo "📥 Pulling latest code..."
git fetch origin main && git reset --hard origin/main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm ci --ignore-scripts

# 3. Build Next.js & Payload application
echo "🔨 Building Next.js & Payload application..."
NODE_OPTIONS="--max-old-space-size=1536" npm run build

# 4. Reload PM2 process
echo "♻️  Reloading PM2 application..."
pm2 reload ecosystem.config.cjs || pm2 start ecosystem.config.cjs
pm2 save

# 5. Health Check
echo "🔥 Checking application health..."
sleep 3
if curl -s -f -H "Host: thenationalfeed.com" http://127.0.0.1:3002 > /dev/null; then
    echo -e "${GREEN}✓ Application updated successfully!${NC}"
else
    echo -e "${RED}⚠️ Warning: Health check returned non-200. Check pm2 logs thenationalfeed${NC}"
fi

echo -e "${GREEN}✅ Deployment complete!${NC}"
pm2 status thenationalfeed

