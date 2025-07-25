const express = require('express');
const router = express.Router();
const controller = require('../controllers/loanController');

// POST /loans
router.post('/loans', controller.createLoan);

// POST /loans/:loan_id/payments
router.post('/loans/:loan_id/payments', controller.recordPayment);

// GET /loans/:loan_id/ledger
router.get('/loans/:loan_id/ledger', controller.getLedger);

// GET /customers/:customer_id/overview
router.get('/customers/:customer_id/overview', controller.getCustomerOverview);

module.exports = router;
