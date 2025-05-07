const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        return;
    }
    console.log('Connected to SQLite database');
});

// Function to show all rows in the book table
function showBooks() {
    const query = 'SELECT * FROM book'; // corrected table name

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error querying books:', err.message);
        } else if (rows.length === 0) {
            console.log('No books found in the table');
        } else {
            console.log('Books in the table:');
            rows.forEach((row) => {
                console.log(`ID: ${row.id}, Name: ${row.bookname}, Author: ${row.book_author}, Category: ${row.category || 'N/A'}`);
            });
        }
    });
}

// 🗑️ Function to delete all books
function deleteAllBooks() {
    const query = 'DELETE FROM book'; // corrected table name

    db.run(query, [], function (err) {
        if (err) {
            console.error('Error deleting books:', err.message);
        } else {
            console.log(`Deleted ${this.changes} books.`);
        }

        // Close the database connection after deletion
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed');
            }
        });
    });
}

// Choose which function to run
showBooks();
// deleteAllBooks(); // <-- Uncomment if you want to delete all books


// const sqlite3 = require('sqlite3').verbose();

// // Connect to SQLite database
// const db = new sqlite3.Database('./database.db', (err) => {
//     if (err) {
//         console.error('❌ Error connecting to database:', err.message);
//         return;
//     }
//     console.log('✅ Connected to SQLite database.');
// });

// // Function to create tables and insert sample data
// function createTables() {
//     // Create users table
//     const createUsersTable = `
//         CREATE TABLE IF NOT EXISTS users (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             username TEXT NOT NULL UNIQUE,
//             address TEXT NOT NULL,
//             phone_number TEXT NOT NULL
//         )
//     `;

//     db.run(createUsersTable, (err) => {
//         if (err) {
//             console.error('❌ Error creating users table:', err.message);
//         } else {
//             console.log('✅ Users table created successfully');
//             // Insert sample row into users table
//             const insertUser = `
//                 INSERT OR IGNORE INTO users (username, address, phone_number)
//                 VALUES (?, ?, ?)
//             `;
//             db.run(insertUser, ['john_doe', '123 Main St, Cityville', '555-0123'], (err) => {
//                 if (err) {
//                     console.error('❌ Error inserting sample user:', err.message);
//                 } else {
//                     console.log('✅ Sample user inserted: john_doe');
//                 }
//             });
//         }
//     });

//     // Create requested_books table
//     const createRequestedBooksTable = `
//         CREATE TABLE IF NOT EXISTS requested_books (
//             id INTEGER PRIMARY KEY AUTOINCREMENT,
//             user_id INTEGER NOT NULL,
//             book_id INTEGER NOT NULL,
//             request_date TEXT NOT NULL,
//             status TEXT NOT NULL DEFAULT 'Pending',
//             FOREIGN KEY (user_id) REFERENCES users(id),
//             FOREIGN KEY (book_id) REFERENCES book(id)
//         )
//     `;

//     db.run(createRequestedBooksTable, (err) => {
//         if (err) {
//             console.error('❌ Error creating requested_books table:', err.message);
//         } else {
//             console.log('✅ Requested_books table created successfully');
//         }
//     });
// }

// // Execute the function and close the database
// createTables();

// // Close the database connection after operations
// db.close((err) => {
//     if (err) {
//         console.error('❌ Error closing database:', err.message);
//     } else {
//         console.log('✅ Database connection closed');
//     }
// });