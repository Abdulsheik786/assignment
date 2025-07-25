import React from 'react';

const Home = ({ setCurrentPage }) => { // Receive setCurrentPage as a prop
    return (
        <div
            className="relative p-8 bg-white rounded-xl shadow-lg max-w-2xl mx-auto mt-10 border border-gray-200 text-center overflow-hidden"
            
        >
            {/* Overlay for text readability */}
            <div className="absolute inset-0 bg-white opacity-90 rounded-xl"></div>

            <div className="relative z-10"> {/* Ensure content is above the overlay */}
                <h2 className="text-4xl font-extrabold mb-6 text-indigo-800">Welcome to the Bank Loan System!</h2>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                    Your simplified platform for managing customer loans and payments.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mx-auto max-w-xl">
                    <div
                        className="p-5 bg-indigo-50 rounded-lg shadow-sm border border-indigo-100 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer flex items-center space-x-4"
                        onClick={() => setCurrentPage('lendLoan')} // Add onClick handler
                    >
                        {/* Icon for Lend Money */}
                        <svg className="w-10 h-10 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0H9m3 0h3m-9 8h10a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm3-12h.01"></path>
                        </svg>
                        <div>
                            <h3 className="text-lg font-bold text-indigo-700 mb-1">Lend Money</h3>
                            <p className="text-gray-700 text-sm">Grant new loans with flexible amounts, periods, and interest rates.</p>
                        </div>
                    </div>
                    <div
                        className="p-5 bg-indigo-50 rounded-lg shadow-sm border border-indigo-100 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer flex items-center space-x-4"
                        onClick={() => setCurrentPage('makePayment')} // Add onClick handler
                    >
                        {/* Icon for Process Payments */}
                        <svg className="w-10 h-10 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0zm-4 4h.01"></path>
                        </svg>
                        <div>
                            <h3 className="text-lg font-bold text-indigo-700 mb-1">Process Payments</h3>
                            <p className="text-gray-700 text-sm">Handle EMI or lump sum payments, updating loan status in real-time.</p>
                        </div>
                    </div>
                    <div
                        className="p-5 bg-indigo-50 rounded-lg shadow-sm border border-indigo-100 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer flex items-center space-x-4"
                        onClick={() => setCurrentPage('viewLedger')} // Add onClick handler
                    >
                        {/* Icon for View Loan Ledger */}
                        <svg className="w-10 h-10 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        <div>
                            <h3 className="text-lg font-bold text-indigo-700 mb-1">View Loan Ledger</h3>
                            <p className="text-gray-700 text-sm">Access detailed transaction history and current loan status.</p>
                        </div>
                    </div>
                    <div
                        className="p-5 bg-indigo-50 rounded-lg shadow-sm border border-indigo-100 hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer flex items-center space-x-4"
                        onClick={() => setCurrentPage('accountOverview')} // Add onClick handler
                    >
                        {/* Icon for Account Overview */}
                        <svg className="w-10 h-10 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10v11h18V10M3 10l9-6 9 6M3 10l-3 3v8a2 2 0 002 2h20a2 2 0 002-2v-8l-3-3M6 10v4a2 2 0 002 2h8a2 2 0 002-2v-4"></path>
                        </svg>
                        <div>
                            <h3 className="text-lg font-bold text-indigo-700 mb-1">Account Overview</h3>
                            <p className="text-gray-700 text-sm">Get a comprehensive summary of all loans for any customer.</p>
                        </div>
                    </div>
                </div>
                <p className="mt-10 text-sm text-gray-500">
                    This system is a simplified demonstration for educational purposes and is not intended for production use.
                </p>
            </div>
        </div>
    );
};

export default Home;