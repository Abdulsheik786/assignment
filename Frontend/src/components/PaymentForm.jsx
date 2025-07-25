import React, { useState } from 'react';
import { makePayment } from '../api/api';

const PaymentForm = () => {
    const [loanId, setLoanId] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentType, setPaymentType] = useState('LUMP_SUM'); // Default to LUMP_SUM
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        try {
            const response = await makePayment(parseInt(loanId), parseFloat(paymentAmount), paymentType);
            setResult(response.updatedLoan); // Access updatedLoan from the response
        } catch (err) {
            setError(err.message || 'An error occurred while processing the payment.');
        }
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-10 border border-gray-200">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-800">Make a Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="loanId" className="block text-sm font-semibold text-gray-700 mb-1">Loan ID</label>
                    <input
                        type="number"
                        id="loanId"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        value={loanId}
                        onChange={(e) => setLoanId(e.target.value)}
                        required
                        min="1"
                    />
                </div>
                <div>
                    <label htmlFor="paymentAmount" className="block text-sm font-semibold text-gray-700 mb-1">Payment Amount</label>
                    <input
                        type="number"
                        id="paymentAmount"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        required
                        step="0.01"
                        min="0.01"
                    />
                </div>
                <div>
                    <label htmlFor="paymentType" className="block text-sm font-semibold text-gray-700 mb-1">Payment Type</label>
                    <select
                        id="paymentType"
                        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                        value={paymentType}
                        onChange={(e) => setPaymentType(e.target.value)}
                    >
                        <option value="LUMP_SUM">Lump Sum</option>
                        <option value="EMI">EMI</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    Process Payment
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
                    <h3 className="text-xl font-bold mb-3">Payment Successful!</h3>
                    <p className="mb-1"><strong>Loan ID:</strong> <span className="font-semibold">{result.id}</span></p>
                    <p className="mb-1"><strong>Amount Paid Till Date:</strong> <span className="font-semibold">${result.amount_paid_till_date.toFixed(2)}</span></p>
                    <p className="mb-1"><strong>Remaining Balance:</strong> <span className="font-semibold">${result.balance_amount.toFixed(2)}</span></p>
                    <p><strong>EMIs Left:</strong> <span className="font-semibold">{result.emis_left}</span></p>
                    <p className="mt-3"><strong>Loan Status:</strong> <span className={`font-semibold ${result.status === 'paid' ? 'text-green-800' : 'text-blue-800'}`}>{result.status.toUpperCase()}</span></p>
                </div>
            )}
        </div>
    );
};

export default PaymentForm;