# 📚 Book Management API with CI/CD Pipeline

A production-ready RESTful API built with **Node.js**, **Express.js**, **MongoDB Atlas**, and **Jest** for testing. Features a complete **CI/CD pipeline** using **GitHub Actions** for automated testing, building, and deployment.

---

## 🚀 Features
- **Complete CRUD API** for Books management
- **MongoDB Atlas** cloud database integration
- **Comprehensive Jest test suite** with 100% endpoint coverage
- **Automated CI/CD pipeline** with GitHub Actions
- **Multi-branch workflow support** (main, develop, feature branches)
- **VPS deployment ready** with PM2 process management
- **Environment-based configuration**
- **Error handling & validation**
- **API documentation** with example requests/responses

---

## 📁 Project Structure
```
project/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── config/
│   │   └── db.js             # MongoDB connection setup
│   ├── controllers/
│   │   └── book.controller.js # Book business logic
│   ├── models/
│   │   └── book.model.js     # MongoDB schema definition
│   └── routes/
│       └── book.routes.js    # API route definitions
├── tests/
│   └── book.test.js          # Jest test suite
├── scripts/                  # Deployment scripts
├── .github/workflows/
│   ├── ci.yml               # Continuous Integration
│   └── cd.yml               # Continuous Deployment
├── server.js                # Application entry point
├── package.json             # Dependencies & scripts
├── .gitignore              # Git ignore patterns
├── .env.example            # Environment variables template
├── README.md               # This file
└── API_DOCUMENTATION.md    # Detailed API docs
```

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB Atlas** account (or local MongoDB)
- **Git** for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Seth724/CI-CD-pipeline-assignment.git
   cd CI-CD-pipeline-assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your MongoDB URI and other settings
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/bookstore?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev    # Uses nodemon for auto-restart
   # OR
   npm start      # Regular node start
   ```

5. **Run the test suite**
   ```bash
   npm test       # Run all tests
   npm run test:watch  # Run tests in watch mode
   ```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start development server with nodemon |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

---

## 🌐 VPS Deployment Setup

### Option 1: Digital Ocean / AWS / GCP VPS

1. **Server Preparation**
   ```bash
   # Update system packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js (NodeSource repository)
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2 globally for process management
   sudo npm install -g pm2
   
   # Install Git
   sudo apt install git -y
   
   # Create application directory
   sudo mkdir -p /var/www/book-api
   sudo chown -R $USER:$USER /var/www/book-api
   ```

2. **Application Deployment**
   ```bash
   # Navigate to app directory
   cd /var/www/book-api
   
   # Clone repository
   git clone https://github.com/Seth724/CI-CD-pipeline-assignment.git .
   
   # Install dependencies
   npm install --production
   
   # Create production environment file
   nano .env
   ```

3. **Environment Configuration (.env)**
   ```bash
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore
   PORT=5000
   NODE_ENV=production
   ```

4. **PM2 Process Management**
   ```bash
   # Start application with PM2
   pm2 start server.js --name "book-api"
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on system reboot
   pm2 startup
   
   # Monitor application
   pm2 status
   pm2 logs book-api
   ```

5. **Nginx Reverse Proxy (Optional)**
   ```bash
   # Install Nginx
   sudo apt install nginx -y
   
   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/book-api
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
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
   
   ```bash
   # Enable the site
   sudo ln -s /etc/nginx/sites-available/book-api /etc/nginx/sites-enabled/
   
   # Test and restart Nginx
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 2: Automated GitHub Actions Deployment

The project includes automated deployment via GitHub Actions that can deploy to your VPS:

1. **Add VPS SSH secrets to GitHub repository:**
   - Go to Repository Settings → Secrets and Variables → Actions
   - Add the following secrets:
     ```
     VPS_HOST=your-server-ip
     VPS_USERNAME=your-server-username
     VPS_SSH_KEY=your-private-ssh-key
     VPS_PATH=/var/www/book-api
     MONGO_URI=your-mongodb-connection-string
     ```

2. **The CD pipeline will automatically:**
   - Connect to your VPS via SSH
   - Pull the latest code
   - Install dependencies
   - Restart the PM2 process
   - Run health checks

---

## 🔄 CI/CD Pipeline Details

### Continuous Integration (CI)
- **Triggers:** Push to `main`, `develop`, or Pull Requests
- **Node.js Versions:** 18.x (configurable matrix)
- **Steps:**
  1. Code checkout
  2. Node.js setup
  3. Dependency installation (`npm ci`)
  4. Linting (if configured)
  5. Test execution (`npm test`)
  6. Coverage report generation

### Continuous Deployment (CD)
- **Triggers:** Successful CI completion on `main` branch
- **Deployment Options:**
  - GitHub Pages deployment (for static builds)
  - VPS deployment via SSH
  - Container deployment (Docker Hub/Registry)
  
### Branch Strategy
- **`main`**: Production-ready code, triggers full CI/CD
- **`develop`**: Integration branch, runs CI only
- **`feature/*`**: Feature branches, runs CI on PR to develop
- **`hotfix/*`**: Critical fixes, runs CI/CD to main

---

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests:** Controller and model logic
- **Integration Tests:** API endpoints with database
- **Coverage Target:** 90%+ line coverage

### Test Environment
```bash
# Run tests with different configurations
npm test                    # Standard test run
npm run test:watch         # Watch mode for development
npm run test:coverage      # With coverage report
npm run test:ci           # CI optimized (no watch, coverage)
```

### Database Testing
- Uses MongoDB Memory Server for isolated testing
- Automatic database setup/teardown for each test suite
- No external dependencies required

---

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore?retryWrites=true&w=majority

# Server Configuration  
PORT=5000
NODE_ENV=development

# Optional: JWT Secret (for future authentication)
JWT_SECRET=your-super-secret-jwt-key

# Optional: API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Environment
For production deployment, ensure these environment variables are securely configured:
- Use environment-specific `.env.production` files
- Never commit `.env` files to version control
- Use secrets management for sensitive data

---

## 📚 API Usage Examples

### Create a Book
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "publishedYear": 1925,
    "isbn": "9780743273565"
  }'
```

### Get All Books
```bash
curl -X GET http://localhost:5000/api/books
```

### Get Book by ID
```bash
curl -X GET http://localhost:5000/api/books/BOOK_ID_HERE
```

### Update a Book
```bash
curl -X PUT http://localhost:5000/api/books/BOOK_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby - Updated Edition",
    "author": "F. Scott Fitzgerald"
  }'
```

### Delete a Book
```bash
curl -X DELETE http://localhost:5000/api/books/BOOK_ID_HERE
```

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Issues
```bash
# Check your MongoDB URI format
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority

# Ensure IP is whitelisted in MongoDB Atlas
# Network Access → Add IP Address → Add Current IP Address
```

#### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/Mac

# Kill the process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                # Linux/Mac
```

#### CI/CD Pipeline Issues
1. **Tests failing in CI but passing locally:**
   - Check Node.js version compatibility
   - Verify environment variables are set in GitHub Secrets
   - Review test timeouts for CI environment

2. **Deployment failures:**
   - Verify SSH keys and server access
   - Check VPS disk space and memory
   - Review PM2 process status: `pm2 status`

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm start

# Check PM2 logs on VPS
pm2 logs book-api --lines 100
```

---

## 🔮 Future Enhancements

### Planned Features
- [ ] **Authentication & Authorization** (JWT tokens)
- [ ] **Input validation** with Joi/Yup
- [ ] **API rate limiting** and security headers
- [ ] **Pagination** for book listings
- [ ] **Search and filtering** capabilities
- [ ] **File upload** for book covers
- [ ] **Email notifications** for book operations
- [ ] **Redis caching** for improved performance
- [ ] **API versioning** support
- [ ] **Swagger/OpenAPI** documentation

### Infrastructure Improvements
- [ ] **Docker containerization**
- [ ] **Kubernetes deployment** manifests
- [ ] **Monitoring** with Prometheus/Grafana
- [ ] **Logging** with ELK stack
- [ ] **Blue-Green deployment** strategy
- [ ] **Database migrations** automation
- [ ] **Backup and recovery** procedures

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and write tests
4. Ensure tests pass: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Maintain test coverage above 90%
- Write meaningful commit messages
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author & Support

**Created by:** Seth724  
**Purpose:** Backend Development Internship Assignment  
**Contact:** [GitHub Profile](https://github.com/Seth724)

### Getting Help
- 📖 Check the [API Documentation](API_DOCUMENTATION.md) for detailed endpoint information
- 🐛 Report bugs by creating an [Issue](https://github.com/Seth724/CI-CD-pipeline-assignment/issues)
- 💡 Request features via [Discussions](https://github.com/Seth724/CI-CD-pipeline-assignment/discussions)
- 📧 For direct support, contact through GitHub

---

## 🙏 Acknowledgments

- **MongoDB Atlas** for cloud database hosting
- **GitHub Actions** for CI/CD infrastructure  
- **Jest** testing framework
- **Express.js** web framework
- **Node.js** community for excellent packages

---

**⭐ Star this repository if you found it helpful!**

