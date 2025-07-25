// src/components/LedgerView.jsx
import React from 'react';

const LedgerView = ({ data = [] }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Ledger</h2>
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{entry.date}</td>
                <td className="p-3">{entry.type}</td>
                <td className="p-3">₹{entry.amount}</td>
                <td className="p-3">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerView;
