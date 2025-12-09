# 📖 Complete API Documentation

This document provides comprehensive information about the Book Management API, including endpoints, request/response formats, and CI/CD pipeline configuration.

---

## 📋 Table of Contents
1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Book API Endpoints](#book-api-endpoints)
4. [Error Handling](#error-handling)
5. [CI/CD Pipeline Configuration](#cicd-pipeline-configuration)
6. [Deployment Guide](#deployment-guide)
7. [Testing Documentation](#testing-documentation)

---

## 🔍 API Overview

### Base URL
- **Development:** `http://localhost:5000`
- **Production:** `https://your-domain.com`

### Content Type
All requests and responses use `application/json` content type.

### HTTP Status Codes
| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Resource deleted successfully |
| 400 | Bad Request - Invalid request data |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## 🔐 Authentication

Currently, the API is open and doesn't require authentication. Future versions will include:
- JWT-based authentication
- Role-based access control (Admin, User)
- API key authentication for external services

---

## 📚 Book API Endpoints

### Book Schema
```json
{
  "_id": "ObjectId",
  "title": "String (required)",
  "author": "String (required)", 
  "genre": "String",
  "publishedYear": "Number",
  "isbn": "String",
  "description": "String",
  "pages": "Number",
  "language": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 1. Create a Book
**Endpoint:** `POST /api/books`

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "publishedYear": 1925,
  "isbn": "9780743273565",
  "description": "A classic American novel",
  "pages": 218,
  "language": "English"
}
```

**Success Response (201):**
```json
{
  "_id": "64f8a1b2c3d4e5f6789abc12",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "publishedYear": 1925,
  "isbn": "9780743273565",
  "description": "A classic American novel",
  "pages": 218,
  "language": "English",
  "createdAt": "2023-12-09T10:30:00.000Z",
  "updatedAt": "2023-12-09T10:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Validation error",
  "message": "Title and author are required",
  "details": {
    "title": "Title is required",
    "author": "Author is required"
  }
}
```

### 2. Get All Books
**Endpoint:** `GET /api/books`

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| page | Number | Page number (default: 1) | `?page=2` |
| limit | Number | Items per page (default: 10) | `?limit=20` |
| sort | String | Sort by field | `?sort=title` |
| genre | String | Filter by genre | `?genre=Fiction` |

**Success Response (200):**
```json
{
  "books": [
    {
      "_id": "64f8a1b2c3d4e5f6789abc12",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "genre": "Fiction",
      "publishedYear": 1925,
      "isbn": "9780743273565",
      "createdAt": "2023-12-09T10:30:00.000Z",
      "updatedAt": "2023-12-09T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalBooks": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 3. Get Book by ID
**Endpoint:** `GET /api/books/:id`

**Success Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6789abc12",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "publishedYear": 1925,
  "isbn": "9780743273565",
  "description": "A classic American novel",
  "pages": 218,
  "language": "English",
  "createdAt": "2023-12-09T10:30:00.000Z",
  "updatedAt": "2023-12-09T10:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Not found",
  "message": "Book not found with id: 64f8a1b2c3d4e5f6789abc12"
}
```

### 4. Update Book
**Endpoint:** `PUT /api/books/:id`

**Request Body (partial update allowed):**
```json
{
  "title": "The Great Gatsby - Special Edition",
  "description": "Updated description with special edition notes"
}
```

**Success Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6789abc12",
  "title": "The Great Gatsby - Special Edition",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "publishedYear": 1925,
  "isbn": "9780743273565",
  "description": "Updated description with special edition notes",
  "pages": 218,
  "language": "English",
  "createdAt": "2023-12-09T10:30:00.000Z",
  "updatedAt": "2023-12-09T10:45:00.000Z"
}
```

### 5. Delete Book
**Endpoint:** `DELETE /api/books/:id`

**Success Response (204):** No content

**Error Response (404):**
```json
{
  "error": "Not found",
  "message": "Book not found with id: 64f8a1b2c3d4e5f6789abc12"
}
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "statusCode": 400,
  "timestamp": "2023-12-09T10:30:00.000Z",
  "path": "/api/books",
  "details": {
    "field": "specific field error message"
  }
}
```

### Common Errors
- **400 Bad Request:** Invalid request data, validation errors
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Database connection issues, server errors

---

## 🔄 CI/CD Pipeline Configuration

### Overview
The CI/CD pipeline is built using **GitHub Actions** and consists of two main workflows:
- **Continuous Integration (CI):** Automated testing and code quality checks
- **Continuous Deployment (CD):** Automated deployment to production environment

### Repository Secrets Configuration

Navigate to **Repository → Settings → Secrets and Variables → Actions** and add:

#### Required Secrets
```bash
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookstore

# Application Configuration  
NODE_ENV=production
PORT=5000

# VPS Deployment (Optional)
VPS_HOST=your-server-ip-address
VPS_USERNAME=your-server-username
VPS_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----
VPS_PATH=/var/www/book-api

# Docker Registry (Optional)
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
```

---

## 🧪 Testing Documentation

### Test Structure
```
tests/
├── unit/                 # Unit tests for models, controllers
│   ├── book.model.test.js
│   └── book.controller.test.js
├── integration/          # API endpoint tests
│   └── book.routes.test.js
├── e2e/                 # End-to-end tests
│   └── book.e2e.test.js
└── helpers/             # Test utilities
    ├── setup.js
    └── fixtures.js
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- book.test.js
```

### Test Coverage Requirements
- **Minimum Coverage:** 90% lines, branches, functions
- **Critical Paths:** 100% coverage for API endpoints
- **Integration Tests:** All CRUD operations tested
- **Error Handling:** All error scenarios covered

---

## 🔄 Branch Strategy & CI/CD Triggers

### Supported Branch Workflows

#### 1. Main Branch (Production)
```yaml
# Triggers: Push to main
# Actions: CI + CD (Full deployment)
on:
  push:
    branches: [ main ]
```

#### 2. Pull Requests
```yaml  
# Triggers: PR to main
# Actions: CI only (No deployment)
on:
  pull_request:
    branches: [ main ]
```

#### 3. Feature Branches
To enable CI on feature branches, update `.github/workflows/ci.yml`:
```yaml
on:
  push:
    branches: [ main, develop, 'feature/*' ]
  pull_request:
    branches: [ main, develop ]
```

#### 4. Multi-Environment Setup
```yaml
# Different environments for different branches
jobs:
  deploy:
    steps:
      - name: Deploy to Staging
        if: github.ref == 'refs/heads/develop'
        run: echo "Deploying to staging environment"
        
      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: echo "Deploying to production environment"
```

### Does CI/CD Work from Other Branches?

**Current Configuration:**
- ✅ **CI runs on:** Push to `main` + PRs to `main`
- ✅ **CD runs on:** Successful CI completion on `main` only

**To Enable Multi-Branch CI/CD:**
1. Modify workflow triggers in `ci.yml`
2. Add branch-specific deployment logic
3. Configure environment-specific secrets
4. Update branch protection rules

---

## 🐛 Troubleshooting Guide

### Common CI/CD Issues

#### 1. Node Modules Not Found
```bash
# Problem: Dependencies not installed properly
# Solution: Use npm ci instead of npm install
- name: Install dependencies
  run: npm ci  # Installs from package-lock.json
```

#### 2. Tests Failing in CI
```bash
# Problem: Environment differences
# Solutions:
- Add timeout for CI environment
- Use MongoDB Memory Server for tests
- Set proper environment variables
- Check Node.js version compatibility
```

#### 3. Deployment Permission Issues  
```bash
# Problem: SSH authentication failure
# Solutions:
- Verify SSH key format (no extra spaces/newlines)
- Check VPS firewall settings
- Ensure correct username and host
- Test SSH connection manually
```

#### 4. PM2 Process Issues
```bash
# Problem: Application not starting after deployment
# Solutions:
pm2 status                    # Check process status
pm2 restart book-api         # Restart specific app
pm2 logs book-api --lines 50 # Check error logs
pm2 delete book-api && pm2 start server.js --name book-api
```

---

## 📊 Monitoring & Alerts

### Health Check Endpoints
```javascript
// Add to your Express app
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
```

### Deployment Notifications
```yaml
# Add to CD workflow for Slack notifications
- name: Notify Deployment Success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: success
    text: "✅ Deployment successful for commit ${{ github.sha }}"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

- name: Notify Deployment Failure  
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    text: "❌ Deployment failed for commit ${{ github.sha }}"
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔧 Advanced Configuration

### Custom Build Steps
```yaml
# Add custom build process to CD workflow
- name: Build Application
  run: |
    npm run build:production
    npm run optimize
    npm run compress
```

### Database Migrations
```yaml
# Add database migration step
- name: Run Database Migrations
  run: |
    npm run migrate:up
    npm run seed:production
```

### Security Scanning
```yaml
# Add security scanning to CI
- name: Run Security Audit
  run: npm audit --audit-level high

- name: Scan for Vulnerabilities
  uses: securecodewarrior/github-action-add-sarif@v1
  with:
    sarif-file: security-scan-results.sarif
```

---

## 📚 Additional Resources

### GitHub Actions Documentation
- [GitHub Actions Quickstart](https://docs.github.com/en/actions/quickstart)
- [Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Environment Variables](https://docs.github.com/en/actions/learn-github-actions/environment-variables)

### VPS Deployment Guides
- [Digital Ocean Node.js Setup](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-20-04)
- [PM2 Process Management](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Reverse Proxy](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

### Best Practices
- [Node.js Production Checklist](https://github.com/i0natan/nodebestpractices)
- [API Security Best Practices](https://owasp.org/www-project-api-security/)
- [MongoDB Security Guide](https://docs.mongodb.com/manual/security/)

---

**For additional support or questions about the CI/CD pipeline, please create an issue in the GitHub repository or refer to the main README documentation.**  
