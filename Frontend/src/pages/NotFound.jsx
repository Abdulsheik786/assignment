import React from 'react';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-gray-200">
                <h1 className="text-7xl font-extrabold text-indigo-600 mb-4">404</h1>
                <p className="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</p>
                {/* <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto"> */}
                <p className='text-red-600'>
                    Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <button
                    onClick={() => window.location.href = '/'} // Simple navigation back to home
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out shadow-md text-lg"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;