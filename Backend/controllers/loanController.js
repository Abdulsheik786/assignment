const { v4: uuidv4 } = require('uuid');
const dbPromise = require('../db/database');


exports.createLoan = async (req, res) => {
  try {
    const db = await dbPromise;
    const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;
    const interest = loan_amount * loan_period_years * (interest_rate_yearly / 100);
    const total_amount = loan_amount + interest;
    const monthly_emi = parseFloat((total_amount / (loan_period_years * 12)).toFixed(2));
    const loan_id = uuidv4();

    await db.run(`
      INSERT INTO Loans (loan_id, customer_id, principal_amount, total_amount, interest_rate, loan_period_years, monthly_emi, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `, [loan_id, customer_id, loan_amount, total_amount, interest_rate_yearly, loan_period_years, monthly_emi]);

    res.status(201).json({ loan_id, customer_id, total_amount_payable: total_amount, monthly_emi });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.recordPayment = async (req, res) => {
  try {
    const db = await dbPromise;
    const { loan_id } = req.params;
    const { amount, payment_type } = req.body;

    const loan = await db.get(`SELECT * FROM Loans WHERE loan_id = ?`, [loan_id]);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    const payment_id = uuidv4();
    await db.run(`
      INSERT INTO Payments (payment_id, loan_id, amount, payment_type)
      VALUES (?, ?, ?, ?)
    `, [payment_id, loan_id, amount, payment_type]);

    const paid = await db.get(`SELECT SUM(amount) as total_paid FROM Payments WHERE loan_id = ?`, [loan_id]);
    const remaining = loan.total_amount - (paid.total_paid || 0);
    const emis_left = Math.ceil(remaining / loan.monthly_emi);

    res.json({
      payment_id,
      loan_id,
      message: 'Payment recorded successfully.',
      remaining_balance: remaining,
      emis_left
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLedger = async (req, res) => {
  try {
    const db = await dbPromise;
    const { loan_id } = req.params;
    const loan = await db.get(`SELECT * FROM Loans WHERE loan_id = ?`, [loan_id]);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    const payments = await db.all(`SELECT * FROM Payments WHERE loan_id = ?`, [loan_id]);
    const amount_paid = payments.reduce((sum, p) => sum + p.amount, 0);
    const balance_amount = loan.total_amount - amount_paid;
    const emis_left = Math.ceil(balance_amount / loan.monthly_emi);

    res.json({
      loan_id,
      customer_id: loan.customer_id,
      principal: loan.principal_amount,
      total_amount: loan.total_amount,
      monthly_emi: loan.monthly_emi,
      amount_paid,
      balance_amount,
      emis_left,
      transactions: payments
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomerOverview = async (req, res) => {
  try {
    const db = await dbPromise;
    const { customer_id } = req.params;
    const loans = await db.all(`SELECT * FROM Loans WHERE customer_id = ?`, [customer_id]);
    if (!loans.length) return res.status(404).json({ error: 'No loans found for this customer' });

    const result = await Promise.all(loans.map(async loan => {
      const payments = await db.all(`SELECT * FROM Payments WHERE loan_id = ?`, [loan.loan_id]);
      const amount_paid = payments.reduce((sum, p) => sum + p.amount, 0);
      const emis_left = Math.ceil((loan.total_amount - amount_paid) / loan.monthly_emi);

      return {
        loan_id: loan.loan_id,
        principal: loan.principal_amount,
        total_amount: loan.total_amount,
        total_interest: loan.total_amount - loan.principal_amount,
        emi_amount: loan.monthly_emi,
        amount_paid,
        emis_left
      };
    }));

    res.json({ customer_id, total_loans: loans.length, loans: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
