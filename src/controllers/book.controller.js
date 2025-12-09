// src/controllers/book.controller.js
const Book = require('../models/book.model');

exports.createBook = async (req, res, next) => {
  try {
    const book = new Book(req.body);
    const saved = await book.save();
    return res.status(201).json(saved);
  } catch (err) {
    return next(err);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find().lean();
    return res.json(books);
  } catch (err) {
    return next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id).lean();
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.json(book);
  } catch (err) {
    return next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updated = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).lean();
    if (!updated) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.json(updated);
  } catch (err) {
    return next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deleted = await Book.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
};
