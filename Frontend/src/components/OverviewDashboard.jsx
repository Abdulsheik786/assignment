import React, { useState } from 'react';
import { getAccountOverview } from '../api/api';

const OverviewDashboard = () => {
    const [customerId, setCustomerId] = useState('');
    const [loans, setLoans] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoans([]);
        setLoading(true);
        try {
            const response = await getAccountOverview(customerId);
            setLoans(response);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching the account overview.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 bg-white rounded-xl shadow-lg max-w-5xl mx-auto mt-10 border border-gray-200">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-800">Account Overview</h2>
            <form onSubmit={handleSubmit} className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
                <label htmlFor="customerId" className="block text-lg font-semibold text-gray-700 sm:w-auto w-full text-center sm:text-left">Enter Customer ID:</label>
                <input
                    type="text"
                    id="customerId"
                    className="flex-grow w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'View Loans'}
                </button>
            </form>

            {error && (
                <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
                    <p className="font-medium">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {loans.length > 0 ? (
                <div className="mt-8 overflow-x-auto rounded-xl shadow-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Loan ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Loan Amount (P)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Total Amount (A)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Monthly EMI
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Total Interest (I)
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Paid Till Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    EMIs Left
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Current Balance
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {loans.map((loan) => (
                                <tr key={loan.loan_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {loan.loan_id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${loan.loan_amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${loan.total_amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${loan.emi_amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${loan.total_interest.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${loan.amount_paid_till_date.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {loan.emis_left}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="font-semibold text-red-600">${loan.current_balance.toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.status === 'paid' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'}`}>
                                            {loan.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                !loading && <p className="mt-6 text-center text-gray-600 text-lg">No loans found for this customer. Please enter a Customer ID and click "View Loans".</p>
            )}
        </div>
    );
};

export default OverviewDashboard;