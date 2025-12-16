// src/app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const bookRoutes = require('./routes/book.routes');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/health', (req, res) => {
  res.status(200).send('ok');
});


app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api/books', bookRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
