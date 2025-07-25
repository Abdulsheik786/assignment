const API_BASE_URL = 'http://localhost:3001/api/loans'; // Backend URL

export const lendLoan = async (loanData) => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loanData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to lend loan');
        }
        return await response.json();
    } catch (error) {
        console.error('Error lending loan:', error);
        throw error;
    }
};

export const makePayment = async (loanId, paymentAmount, paymentType = 'LUMP_SUM') => {
    try {
        const response = await fetch(`${API_BASE_URL}/${loanId}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ payment_amount: paymentAmount, type: paymentType }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to make payment');
        }
        return await response.json();
    } catch (error) {
        console.error('Error making payment:', error);
        throw error;
    }
};

export const getLedger = async (loanId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${loanId}/ledger`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch ledger');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching ledger:', error);
        throw error;
    }
};

export const getAccountOverview = async (customerId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/customer/${customerId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch account overview');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching account overview:', error);
        throw error;
    }
};