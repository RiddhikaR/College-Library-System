require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION) // ✅ Removed deprecated options
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

// Define Book Schema
const bookSchema = new mongoose.Schema({
    name: String,
    author: String,
    isbn: String,
    subject: String,
    availability: Number
});

// Create Book Model
const Book = mongoose.model('Book', bookSchema);
app.post('/addBook', async (req, res) => {
    try {
        const { name, author, isbn, subject, availability } = req.body;

        const newBook = new Book({ name, author, isbn, subject, availability });
        await newBook.save();

        res.json({ success: true, message: 'Book added successfully' });
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Error adding book' });
    }
});

// 📌 Search books endpoint
app.get('/search', async (req, res) => {
    try {
        const { name, author, isbn, subject } = req.query;
        let query = {};

        if (name) query.name = { $regex: name, $options: 'i' };
        if (author) query.author = { $regex: author, $options: 'i' };
        if (isbn) query.isbn = { $regex: isbn, $options: 'i' };
        if (subject) query.subject = { $regex: subject, $options: 'i' };

        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Error searching books' });
    }
});

// 📌 Reserve book endpoint
app.patch('/reserve/:bookId', async (req, res) => {
    try {
        const bookId = req.params.bookId;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.availability <= 0) return res.status(400).json({ message: 'No available copies left' });

        book.availability -= 1;
        await book.save();

        res.json({ success: true, message: 'Book reserved successfully' });
    } catch (error) {
        console.error('Error reserving book:', error);
        res.status(500).json({ message: 'Error reserving book' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
