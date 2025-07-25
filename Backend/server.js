const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Import cors middleware

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Body parser for JSON requests

// Initialize SQLite Database
const db = new sqlite3.Database('./bank.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create tables if they don't exist
        db.serialize(() => {
            // Loans table to store loan details
            db.run(`CREATE TABLE IF NOT EXISTS loans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id TEXT NOT NULL,
                principal_amount REAL NOT NULL,
                interest_rate REAL NOT NULL,
                loan_period_years REAL NOT NULL,
                total_amount_to_pay REAL NOT NULL,
                monthly_emi REAL NOT NULL,
                amount_paid_till_date REAL DEFAULT 0,
                emis_left INTEGER NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'active' -- 'active', 'paid'
            )`);

            // Transactions table to store payment history for each loan
            db.run(`CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                loan_id INTEGER NOT NULL,
                payment_amount REAL NOT NULL,
                payment_date TEXT DEFAULT CURRENT_TIMESTAMP,
                type TEXT NOT NULL, -- 'EMI', 'LUMP_SUM'
                description TEXT,
                FOREIGN KEY (loan_id) REFERENCES loans(id)
            )`);
            console.log('Database tables checked/created.');
        });
    }
});

// Import loan routes
const loanRoutes = require('./routes/loanRoutes')(db); // Pass the db object to routes

// Use loan routes
app.use('/api/loans', loanRoutes);

// Basic route for root URL
app.get('/', (req, res) => {
    res.send('Bank Loan System Backend is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
