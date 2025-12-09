// src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    // Skip database connection in CI environment
    if (process.env.CI || process.env.GITHUB_ACTIONS) {
      console.log('CI environment detected - skipping database connection');
      return;
    }
    
    if (!uri) {
      console.warn('MONGODB_URI not set. Skipping connection (use .env).');
      return;
    }
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    // Don't throw in CI - just log and continue
    if (!process.env.CI && !process.env.GITHUB_ACTIONS) {
      throw err;
    }
  }
};

module.exports = connectDB;
