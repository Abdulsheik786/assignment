// src/pages/Home.jsx
import React from 'react';
import OverviewDashboard from '../components/OverviewDashboard';
import LoanForm from '../components/LoanForm';
import PaymentForm from '../components/PaymentForm';
import LedgerView from '../components/LedgerView';

const dummyLedger = [
  { date: '2025-07-01', type: 'Loan', amount: 10000, status: 'Approved' },
  { date: '2025-07-15', type: 'Payment', amount: 2000, status: 'Completed' },
];

const Home = () => {
  return (
    <div className="p-4 space-y-6">
      <OverviewDashboard />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoanForm />
        <PaymentForm />
      </div>
      <LedgerView data={dummyLedger} />
    </div>
  );
};

export default Home;
