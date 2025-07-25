import React, { useState } from 'react';
import { getLedger } from '../api/api';

const LedgerView = () => {
    const [loanId, setLoanId] = useState('');
    const [ledger, setLedger] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLedger(null);
        setLoading(true);
        try {
            const response = await getLedger(parseInt(loanId));
            setLedger(response);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching the ledger.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-lg max-w-3xl mx-auto mt-10 border border-gray-200">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-800">Loan Ledger</h2>
            <form onSubmit={handleSubmit} className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
                <label htmlFor="loanId" className="block text-lg font-semibold text-gray-700 sm:w-auto w-full text-center sm:text-left">Enter Loan ID:</label>
                <input
                    type="number"
                    id="loanId"
                    className="flex-grow w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    value={loanId}
                    onChange={(e) => setLoanId(e.target.value)}
                    required
                    min="1"
                />
                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'View Ledger'}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
                    <p className="font-medium">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {ledger && (
                <div className="mt-8">
                    <h3 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-3">Loan Details (Loan ID: {ledger.loan_id})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-gray-700 mb-8">
                        <p><strong>Customer ID:</strong> <span className="font-medium">{ledger.customer_id}</span></p>
                        <p><strong>Principal Amount:</strong> <span className="font-medium">${ledger.principal_amount.toFixed(2)}</span></p>
                        <p><strong>Total Amount to Pay:</strong> <span className="font-medium">${ledger.total_amount_to_pay.toFixed(2)}</span></p>
                        <p><strong>Monthly EMI:</strong> <span className="font-medium">${ledger.monthly_emi.toFixed(2)}</span></p>
                        <p><strong>Amount Paid Till Date:</strong> <span className="font-medium">${ledger.amount_paid_till_date.toFixed(2)}</span></p>
                        <p><strong>Balance Amount:</strong> <span className="font-medium text-red-600">${ledger.balance_amount.toFixed(2)}</span></p>
                        <p><strong>EMIs Left:</strong> <span className="font-medium">{ledger.emis_left}</span></p>
                        <p><strong>Status:</strong> <span className={`font-semibold px-3 py-1 rounded-full text-sm ${ledger.status === 'paid' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>{ledger.status.toUpperCase()}</span></p>
                    </div>

                    <h3 className="text-2xl font-bold mb-5 text-gray-800 border-b pb-3">Transaction History</h3>
                    {ledger.transactions && ledger.transactions.length > 0 ? (
                        <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Description
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {ledger.transactions.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {transaction.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className="font-semibold text-green-700">${transaction.payment_amount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(transaction.payment_date).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.description}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-center py-4">No transactions found for this loan.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default LedgerView;