import React, { useState } from 'react';
import Home from './pages/Home';
import LoanForm from './components/LoanForm';
import PaymentForm from './components/PaymentForm';
import LedgerView from './components/LedgerView';
import OverviewDashboard from './components/OverviewDashboard';
import NotFound from './pages/NotFound'; // Import NotFound component

function App() {
    // State to manage which component is currently displayed
    const [currentPage, setCurrentPage] = useState('home');

    // Function to render the current page component
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home setCurrentPage={setCurrentPage} />; 
            case 'lendLoan':
                return <LoanForm />;
            case 'makePayment':
                return <PaymentForm />;
            case 'viewLedger':
                return <LedgerView />;
            case 'accountOverview':
                return <OverviewDashboard />;
            default:
                return <NotFound />; // Render NotFound for unknown pages
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter text-gray-900">
            {/* Navigation Bar */}
            <nav className="bg-indigo-500 p-4 shadow-xl">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="text-white text-3xl font-extrabold mb-4 md:mb-0">
                        BankPro
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-end gap-3">
                        <button
                            onClick={() => setCurrentPage('home')}
                            className={`px-5 py-2 rounded-lg transition duration-200 ease-in-out text-lg font-medium ${currentPage === 'home' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={() => setCurrentPage('lendLoan')}
                            className={`px-5 py-2 rounded-lg transition duration-200 ease-in-out text-lg font-medium ${currentPage === 'lendLoan' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}
                        >
                            Lend Loan
                        </button>
                        <button
                            onClick={() => setCurrentPage('makePayment')}
                            className={`px-5 py-2 rounded-lg transition duration-200 ease-in-out text-lg font-medium ${currentPage === 'makePayment' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}
                        >
                            Make Payment
                        </button>
                        <button
                            onClick={() => setCurrentPage('viewLedger')}
                            className={`px-5 py-2 rounded-lg transition duration-200 ease-in-out text-lg font-medium ${currentPage === 'viewLedger' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}
                        >
                            View Ledger
                        </button>
                        <button
                            onClick={() => setCurrentPage('accountOverview')}
                            className={`px-5 py-2 rounded-lg transition duration-200 ease-in-out text-lg font-medium ${currentPage === 'accountOverview' ? 'bg-indigo-800 text-white shadow-md' : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'}`}
                        >
                            Account Overview
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
             <main
                className="container mx-auto p-4 sm:p-6 lg:p-8 relative z-0"
                style={{
                    backgroundImage: `url(https://plus.unsplash.com/premium_photo-1661757762481-676c2690d8ac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmFua2luZ3xlbnwwfHwwfHx8MA%3D%3D)`, // Main content background
                    backgroundSize: 'cover',
                    height:"100vh",
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            >
                {/* Overlay for the main content background */}
                <div className="absolute inset-0  opacity-80 z-10 "></div>
                <div className="relative z-20"> {/* Ensure rendered page content is above overlay */}
                    {renderPage()}
                </div>
            </main>
        </div>
    );
}

export default App;