const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for cross-origin requests

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database.');
    }
});

// Create 'book' table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bookname TEXT NOT NULL,
        book_author TEXT NOT NULL,
        category TEXT NOT NULL
    )
`);

// Create 'users' table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        address TEXT NOT NULL,
        phone_number TEXT NOT NULL
    )
`);

// Create 'requested_books' table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS requested_books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        book_id INTEGER NOT NULL,
        request_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (book_id) REFERENCES book(id)
    )
`);

// ➕ Add Book API
app.post('/add-book', (req, res) => {
    const { bookname, book_author, category } = req.body;

    if (!bookname || !book_author || !category) {
        return res.status(400).json({ error: 'bookname, book_author, and category are required' });
    }

    const query = `INSERT INTO book (bookname, book_author, category) VALUES (?, ?, ?)`;
    db.run(query, [bookname, book_author, category], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Book added successfully', bookId: this.lastID });
    });
});

// 📚 Get All Books API
app.get('/books', (req, res) => {
    const query = `SELECT * FROM book`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 📖 Request Book API
app.post('/request-book', (req, res) => {
    const { user_id, book_id, request_date, status = 'Pending' } = req.body;

    if (!user_id || !book_id || !request_date) {
        return res.status(400).json({ error: 'user_id, book_id, and request_date are required' });
    }

    const query = `
        INSERT INTO requested_books (user_id, book_id, request_date, status)
        VALUES (?, ?, ?, ?)
    `;
    db.run(query, [user_id, book_id, request_date, status], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Book request created successfully', requestId: this.lastID });
    });
});

// 📚 Get User's Requested Books API
app.get('/my-books/:userId', (req, res) => {
    const { userId } = req.params;
    const query = `
        SELECT rb.id, rb.request_date, rb.status, b.bookname, b.book_author, b.category
        FROM requested_books rb
        JOIN book b ON rb.book_id = b.id
        WHERE rb.user_id = ?
    `;
    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// ➖ Delete a specific book by ID
app.delete('/delete-book/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM book WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json({ message: 'Book deleted successfully' });
    });
});

// New: Delete all books
app.delete('/delete-all-books', (req, res) => {
    db.run('DELETE FROM books', function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, message: `Deleted ${this.changes} books.` });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
