const express = require('express');
const router = express.Router();

module.exports = (db) => {
    /**
     * LEND Function:
     * Allows the bank to give loans to customers.
     * Calculates Total amount (A) and monthly EMI.
     *
     * @param {string} customer_id - ID of the customer.
     * @param {number} loan_amount - Principal loan amount (P).
     * @param {number} loan_period_years - Loan period in years (N).
     * @param {number} rate_of_interest - Annual rate of interest (R, as a percentage, e.g., 5 for 5%).
     * @returns {object} - Total amount (A) and monthly EMI.
     */
    router.post('/', (req, res) => {
        const { customer_id, loan_amount, loan_period_years, rate_of_interest } = req.body;

        // Input validation
        if (!customer_id || typeof loan_amount !== 'number' || loan_amount <= 0 ||
            typeof loan_period_years !== 'number' || loan_period_years <= 0 ||
            typeof rate_of_interest !== 'number' || rate_of_interest < 0) {
            return res.status(400).json({ error: 'Invalid input. Please provide valid customer_id, loan_amount, loan_period_years, and rate_of_interest.' });
        }

        // Calculations based on simple interest
        // I (Interest) = P * N * R (where R is decimal)
        const total_interest = loan_amount * loan_period_years * (rate_of_interest / 100);
        // A (Total Amount) = P + I
        const total_amount_to_pay = loan_amount + total_interest;

        // Assumption: Monthly EMI is Total Amount / Total Number of Months
        const num_emis = loan_period_years * 12;
        const monthly_emi = total_amount_to_pay / num_emis;

        // Round to 2 decimal places for currency
        const rounded_total_amount = parseFloat(total_amount_to_pay.toFixed(2));
        const rounded_monthly_emi = parseFloat(monthly_emi.toFixed(2));

        db.run(
            `INSERT INTO loans (customer_id, principal_amount, interest_rate, loan_period_years, total_amount_to_pay, monthly_emi, emis_left, amount_paid_till_date, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [customer_id, loan_amount, rate_of_interest, loan_period_years, rounded_total_amount, rounded_monthly_emi, num_emis, 0, 'active'],
            function (err) {
                if (err) {
                    console.error('Error inserting loan:', err.message);
                    return res.status(500).json({ error: 'Failed to lend loan.' });
                }
                res.status(201).json({
                    message: 'Loan successfully granted.',
                    loan_id: this.lastID,
                    total_amount_to_pay: rounded_total_amount,
                    monthly_emi: rounded_monthly_emi
                });
            }
        );
    });

    /**
     * PAYMENT Function:
     * Allows customers to pay back loans (EMI or LUMP SUM).
     * Lump sum reduces total amount and can reduce EMIs.
     *
     * @param {number} loanId - ID of the loan to pay.
     * @param {number} payment_amount - Amount to pay.
     * @param {string} [type='LUMP_SUM'] - Type of payment ('EMI' or 'LUMP_SUM').
     * @returns {object} - Updated loan details.
     */
    router.post('/:loanId/payment', (req, res) => {
        const loanId = req.params.loanId;
        const { payment_amount, type = 'LUMP_SUM' } = req.body; // Default to LUMP_SUM if not specified

        // Input validation
        if (typeof payment_amount !== 'number' || payment_amount <= 0) {
            return res.status(400).json({ error: 'Invalid payment amount. Must be a positive number.' });
        }

        db.get(`SELECT * FROM loans WHERE id = ?`, [loanId], (err, loan) => {
            if (err) {
                console.error('Error fetching loan for payment:', err.message);
                return res.status(500).json({ error: 'Failed to process payment.' });
            }
            if (!loan) {
                return res.status(404).json({ error: 'Loan not found.' });
            }
            if (loan.status === 'paid') {
                return res.status(400).json({ error: 'This loan has already been fully paid.' });
            }

            let new_amount_paid_till_date = loan.amount_paid_till_date + payment_amount;
            let new_balance_amount = loan.total_amount_to_pay - new_amount_paid_till_date;

            // Ensure balance doesn't go below zero
            if (new_balance_amount < 0) {
                new_balance_amount = 0;
                new_amount_paid_till_date = loan.total_amount_to_pay; // Cap paid amount at total
            }

            // Recalculate emis_left based on new balance and original monthly EMI
            // If monthly_emi is 0 (e.g., very short loan period resulting in 0 EMI), handle division by zero
            let new_emis_left = 0;
            if (loan.monthly_emi > 0) {
                new_emis_left = Math.ceil(new_balance_amount / loan.monthly_emi);
            }
            // Ensure emis_left doesn't go below zero
            if (new_emis_left < 0) {
                new_emis_left = 0;
            }

            let new_status = new_balance_amount <= 0.01 ? 'paid' : 'active'; // Account for floating point inaccuracies

            db.run(
                `UPDATE loans
                 SET amount_paid_till_date = ?, emis_left = ?, status = ?
                 WHERE id = ?`,
                [new_amount_paid_till_date, new_emis_left, new_status, loanId],
                function (err) {
                    if (err) {
                        console.error('Error updating loan after payment:', err.message);
                        return res.status(500).json({ error: 'Failed to update loan after payment.' });
                    }

                    // Insert transaction record
                    db.run(
                        `INSERT INTO transactions (loan_id, payment_amount, type, description)
                         VALUES (?, ?, ?, ?)`,
                        [loanId, payment_amount, type, `Payment of ${payment_amount} (${type})`],
                        function (err) {
                            if (err) {
                                console.error('Error inserting transaction:', err.message);
                                // Note: Loan was updated, but transaction failed. This needs more robust handling in production.
                                return res.status(500).json({ error: 'Payment processed, but failed to record transaction.' });
                            }

                            // Fetch updated loan details to return
                            db.get(`SELECT * FROM loans WHERE id = ?`, [loanId], (err, updatedLoan) => {
                                if (err) {
                                    console.error('Error fetching updated loan:', err.message);
                                    return res.status(500).json({ error: 'Payment processed, but failed to retrieve updated loan details.' });
                                }
                                res.status(200).json({
                                    message: 'Payment successfully processed.',
                                    updatedLoan: {
                                        ...updatedLoan,
                                        balance_amount: parseFloat(new_balance_amount.toFixed(2)) // Return calculated balance
                                    }
                                });
                            });
                        }
                    );
                }
            );
        });
    });

    /**
     * LEDGER Function:
     * Allows customers to check all transactions for a loan ID.
     * Returns all transactions, balance amount, monthly EMI, and number of EMI left.
     *
     * @param {number} loanId - ID of the loan.
     * @returns {object} - Loan details and a list of transactions.
     */
    router.get('/:loanId/ledger', (req, res) => {
        const loanId = req.params.loanId;

        db.get(`SELECT * FROM loans WHERE id = ?`, [loanId], (err, loan) => {
            if (err) {
                console.error('Error fetching loan for ledger:', err.message);
                return res.status(500).json({ error: 'Failed to retrieve loan ledger.' });
            }
            if (!loan) {
                return res.status(404).json({ error: 'Loan not found.' });
            }

            // Calculate current balance
            const balance_amount = parseFloat((loan.total_amount_to_pay - loan.amount_paid_till_date).toFixed(2));

            db.all(`SELECT * FROM transactions WHERE loan_id = ? ORDER BY payment_date ASC`, [loanId], (err, transactions) => {
                if (err) {
                    console.error('Error fetching transactions for ledger:', err.message);
                    return res.status(500).json({ error: 'Failed to retrieve transactions for loan ledger.' });
                }

                res.status(200).json({
                    loan_id: loan.id,
                    customer_id: loan.customer_id,
                    principal_amount: loan.principal_amount,
                    total_amount_to_pay: loan.total_amount_to_pay,
                    monthly_emi: loan.monthly_emi,
                    amount_paid_till_date: loan.amount_paid_till_date,
                    emis_left: loan.emis_left,
                    balance_amount: balance_amount,
                    status: loan.status,
                    transactions: transactions
                });
            });
        });
    });

    /**
     * ACCOUNT OVERVIEW Function:
     * Lists all loans taken by a customer.
     * For each loan: loan amount (P), Total amount (A), EMI amount, Total Interest (I),
     * amount paid till date, number of EMI left.
     *
     * @param {string} customerId - ID of the customer.
     * @returns {array} - List of loan objects.
     */
    router.get('/customer/:customerId', (req, res) => {
        const customerId = req.params.customerId;

        db.all(`SELECT * FROM loans WHERE customer_id = ?`, [customerId], (err, loans) => {
            if (err) {
                console.error('Error fetching loans for account overview:', err.message);
                return res.status(500).json({ error: 'Failed to retrieve account overview.' });
            }

            const overview = loans.map(loan => {
                const total_interest = parseFloat((loan.total_amount_to_pay - loan.principal_amount).toFixed(2));
                const balance_amount = parseFloat((loan.total_amount_to_pay - loan.amount_paid_till_date).toFixed(2));

                return {
                    loan_id: loan.id,
                    customer_id: loan.customer_id,
                    loan_amount: loan.principal_amount,
                    total_amount: loan.total_amount_to_pay,
                    emi_amount: loan.monthly_emi,
                    total_interest: total_interest,
                    amount_paid_till_date: loan.amount_paid_till_date,
                    emis_left: loan.emis_left,
                    current_balance: balance_amount, // Added for convenience
                    status: loan.status
                };
            });

            res.status(200).json(overview);
        });
    });

    return router;
};