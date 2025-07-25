import React, { useState } from 'react';
import { lendLoan } from '../api/api';

const LoanForm = () => {
    const [customerId, setCustomerId] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [loanPeriod, setLoanPeriod] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        try {
            const data = {
                customer_id: customerId,
                loan_amount: parseFloat(loanAmount),
                loan_period_years: parseFloat(loanPeriod),
                rate_of_interest: parseFloat(interestRate),
            };
            const response = await lendLoan(data);
            setResult(response);
        } catch (err) {
            setError(err.message || 'An error occurred while lending the loan.');
        }
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-10 border border-gray-200">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-800">Lend New Loan</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="customerId" className="block text-sm font-semibold text-gray-700 mb-1">Customer ID</label>
                    <input
                        type="text"
                        id="customerId"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="loanAmount" className="block text-sm font-semibold text-gray-700 mb-1">Loan Amount (P)</label>
                    <input
                        type="number"
                        id="loanAmount"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        required
                        step="0.01"
                        min="0"
                    />
                </div>
                <div>
                    <label htmlFor="loanPeriod" className="block text-sm font-semibold text-gray-700 mb-1">Loan Period (N - Years)</label>
                    <input
                        type="number"
                        id="loanPeriod"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        value={loanPeriod}
                        onChange={(e) => setLoanPeriod(e.target.value)}
                        required
                        min="0.1"
                        step="0.1"
                    />
                </div>
                <div>
                    <label htmlFor="interestRate" className="block text-sm font-semibold text-gray-700 mb-1">Rate of Interest (I - %)</label>
                    <input
                        type="number"
                        id="interestRate"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        required
                        step="0.01"
                        min="0"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    Lend Loan
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
                    <p className="font-medium">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    <h3 className="text-xl font-bold mb-3">Loan Successfully Granted!</h3>
                    <p className="mb-1"><strong>Loan ID:</strong> <span className="font-semibold">{result.loan_id}</span></p>
                    <p className="mb-1"><strong>Total Amount to Pay (A):</strong> <span className="font-semibold">${result.total_amount_to_pay.toFixed(2)}</span></p>
                    <p><strong>Monthly EMI:</strong> <span className="font-semibold">${result.monthly_emi.toFixed(2)}</span></p>
                    <p className="mt-3 text-sm text-gray-600">This loan has been recorded in the system.</p>
                </div>
            )}
        </div>
    );
};

export default LoanForm;