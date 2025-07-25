const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const init = async () => {
  const db = await open({
    filename: path.join(__dirname, '../bank.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Customers (
      customer_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Loans (
      loan_id TEXT PRIMARY KEY,
      customer_id TEXT,
      principal_amount REAL,
      total_amount REAL,
      interest_rate REAL,
      loan_period_years INTEGER,
      monthly_emi REAL,
      status TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(customer_id) REFERENCES Customers(customer_id)
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS Payments (
      payment_id TEXT PRIMARY KEY,
      loan_id TEXT,
      amount REAL,
      payment_type TEXT,
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(loan_id) REFERENCES Loans(loan_id)
    );
  `);

  return db;
};

module.exports = init();
