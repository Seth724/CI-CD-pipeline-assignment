#!/bin/bash
# Deployment script for Book Management API

set -e

echo "🚀 Starting deployment process..."

# Configuration
APP_DIR="/var/www/book-api"
REPO_URL="https://github.com/Seth724/CI-CD-pipeline-assignment.git"
APP_NAME="book-api"

# Navigate to application directory
cd $APP_DIR

# Check if this is first deployment
if [ ! -d ".git" ]; then
    echo "📥 First deployment - cloning repository..."
    git clone $REPO_URL .
else
    echo "🔄 Updating existing deployment..."
    # Stash any local changes
    git stash --include-untracked
    # Pull latest changes
    git pull origin main
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file template..."
    cat > .env << 'EOF'
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=production

# Add your actual MongoDB URI here
EOF
    echo "⚠️  Please edit .env file with your actual MongoDB credentials!"
    exit 1
fi

# Run tests to ensure everything is working
echo "🧪 Running tests..."
npm test

# Stop existing PM2 process if running
echo "🔄 Managing PM2 process..."
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true

# Start application with PM2
echo "🚀 Starting application..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup (run once)
pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || true

# Show status
echo "✅ Deployment completed!"
pm2 status
echo ""
echo "🌐 Application is running at:"
echo "   Local: http://localhost:5000"
echo "   External: http://$(curl -s ifconfig.me):5000"
echo ""
echo "📊 Monitor logs with: pm2 logs $APP_NAME"