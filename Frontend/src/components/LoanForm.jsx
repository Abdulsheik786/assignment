// src/components/LoanForm.jsx
import React, { useState } from 'react';

const LoanForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ amount: '', reason: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
    setForm({ amount: '', reason: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-xl space-y-4">
      <h2 className="text-xl font-bold">Apply for Loan</h2>
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        className="w-full p-2 border rounded"
        value={form.amount}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="reason"
        placeholder="Reason"
        className="w-full p-2 border rounded"
        value={form.reason}
        onChange={handleChange}
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit Loan
      </button>
    </form>
  );
};

export default LoanForm;
