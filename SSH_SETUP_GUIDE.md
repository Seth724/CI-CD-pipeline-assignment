# SSH Key Generation and Setup Guide

## 1. Generate SSH Key Pair (Local Machine)
```bash
# Generate new SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions-book-api"

# When prompted, save as: ~/.ssh/github_actions_book_api
# Leave passphrase empty for automated deployment
```

## 2. Add Public Key to Digital Ocean Droplet
```bash
# Copy public key content
cat ~/.ssh/github_actions_book_api.pub

# SSH into your droplet and add the key
ssh root@your-droplet-ip

# On the droplet, add public key to authorized_keys
mkdir -p ~/.ssh
echo "your-public-key-content-here" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys

# Test the connection
exit
ssh -i ~/.ssh/github_actions_book_api root@your-droplet-ip
```

## 3. Add Private Key to GitHub Secrets
```bash
# Copy private key content (including BEGIN/END lines)
cat ~/.ssh/github_actions_book_api

# Add this entire content to GitHub Secrets as DO_SSH_KEY
```

## 4. Required GitHub Secrets
- DO_HOST: Your droplet IP address
- DO_USERNAME: root (or your droplet username)
- DO_SSH_KEY: Private key content (entire key including headers)
- DO_PORT: 22 (unless you changed SSH port)
- MONGO_URI: Your MongoDB Atlas connection string

## 5. Test SSH Connection
```bash
# Test connection with the key
ssh -i ~/.ssh/github_actions_book_api root@your-droplet-ip "echo 'Connection successful!'"
```