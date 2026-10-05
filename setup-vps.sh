#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting The National Feed Automated VPS Setup...${NC}"

# 1. Install Docker if not present
if ! [ -x "$(command -v docker)" ]; then
    echo "📦 Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo -e "${GREEN}✓ Docker is already installed.${NC}"
fi

# 2. Check for .env file
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file is missing!${NC}"
    echo "Please copy your local .env file to the VPS root folder first."
    echo "Run this locally in a separate terminal tab:"
    echo -e "${GREEN}scp /path/to/thenationalfeed/.env root@YOUR_VPS_IP:$(pwd)/.env${NC}"
    exit 1
fi
echo -e "${GREEN}✓ .env file found.${NC}"

# 3. Check for SSL Certificates
echo "🔒 Checking SSL Certificates..."
# Find any volume matching "certbot_certs" to make it directory-agnostic
VOLUME_NAME=$(docker volume ls -q | grep certbot_certs | head -n 1)

if [ -n "$VOLUME_NAME" ] && docker run --rm -v "$VOLUME_NAME":/etc/letsencrypt alpine ls /etc/letsencrypt/live/thenationalfeed.com/fullchain.pem >/dev/null 2>&1; then
    echo -e "${GREEN}✓ SSL Certificates already exist. Skipping certificate generation.${NC}"
else
    echo "⚠️ SSL Certificates not found. Initiating Let's Encrypt SSL Bootstrap..."

    # Fallback email for SSL registration
    EMAIL="admin@thenationalfeed.com"

    echo "🛑 Ensuring port 80 is free (stopping Nginx)..."
    docker compose -f docker-compose.prod.yml down nginx || true

    echo "🔑 Requesting Let's Encrypt Certificate in Standalone Mode..."
    docker compose -f docker-compose.prod.yml run --rm -p 80:80 --entrypoint "certbot" certbot certonly \
      --standalone \
      -d thenationalfeed.com \
      -d www.thenationalfeed.com \
      --email "$EMAIL" \
      --agree-tos \
      --no-eff-email
fi

# 4. Start all services in production mode
echo "⚡ Starting all services..."
docker compose -f docker-compose.prod.yml up -d db app nginx

echo -e "${GREEN}✅ Setup complete! The National Feed is now running at https://thenationalfeed.com${NC}"
