#!/bin/bash
# Digital Ocean VPS Setup Script for Book API

echo "Starting server setup for Book Management API..."

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x (LTS)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js and npm installation
echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install PM2 globally for process management
echo "Installing PM2..."
sudo npm install -g pm2

# Install Git
sudo apt install git -y

# Install Nginx (for reverse proxy)
echo "Installing Nginx..."
sudo apt install nginx -y

# Create application directory
echo "Creating application directory..."
sudo mkdir -p /var/www/book-api
sudo chown -R $USER:$USER /var/www/book-api

# Configure firewall
echo "Configuring UFW firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000
sudo ufw --force enable

# Create ecosystem file for PM2
echo "Creating PM2 ecosystem file..."
cat > /var/www/book-api/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'book-api',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

echo "Server setup completed!"
echo "Next steps:"
echo "1. Clone your repository to /var/www/book-api"
echo "2. Create .env file with your MongoDB credentials"
echo "3. Run deployment script"