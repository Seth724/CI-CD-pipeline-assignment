# Manual Deployment Setup Guide for Digital Ocean

## 1. SSH into your Digital Ocean Droplet
```bash
ssh root@your-droplet-ip
```

## 2. Run the server setup script
```bash
# Download and run setup script
curl -sSL https://raw.githubusercontent.com/Seth724/CI-CD-pipeline-assignment/main/scripts/server-setup.sh | bash
```

## 3. Clone your repository manually (first time)
```bash
cd /var/www/book-api
git clone https://github.com/Seth724/CI-CD-pipeline-assignment.git .
```

## 4. Create environment file
```bash
# Create .env file with your MongoDB credentials
nano .env
```

Add this content to .env:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore?retryWrites=true&w=majority
PORT=5000
NODE_ENV=production
```

## 5. Install dependencies and start application
```bash
# Install dependencies
npm ci --only=production

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 6. Test the deployment
```bash
# Check if application is running
curl http://localhost:5000

# Check PM2 status
pm2 status

# View logs
pm2 logs book-api
```

## 7. Configure Nginx (Optional - for production)
```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/book-api
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your droplet IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/book-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 8. Test API endpoints
```bash
# Test all endpoints
curl http://your-droplet-ip/api/books
curl -X POST http://your-droplet-ip/api/books -H "Content-Type: application/json" -d '{"title":"Test Book","author":"Test Author","genre":"Fiction","publishedYear":2023}'
```