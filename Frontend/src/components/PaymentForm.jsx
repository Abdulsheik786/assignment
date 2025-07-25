// src/components/PaymentForm.jsx
import React, { useState } from 'react';

const PaymentForm = ({ onPay }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onPay?.(amount);
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-xl space-y-4">
      <h2 className="text-xl font-bold">Make a Payment</h2>
      <input
        type="number"
        placeholder="Amount"
        className="w-full p-2 border rounded"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Pay Now
      </button>
    </form>
  );
};

export default PaymentForm;
