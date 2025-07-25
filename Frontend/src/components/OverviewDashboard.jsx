// src/components/OverviewDashboard.jsx
import React from 'react';

const stats = [
  { label: "Total Balance", value: "₹1,25,000" },
  { label: "Total Loans", value: "₹50,000" },
  { label: "Pending Payments", value: "₹20,000" },
];

const OverviewDashboard = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow p-6 hover:scale-105 transition">
          <h4 className="text-gray-600 text-sm">{stat.label}</h4>
          <p className="text-2xl font-bold text-blue-600 mt-2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default OverviewDashboard;
