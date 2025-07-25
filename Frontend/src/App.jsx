import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoanForm from './components/LoanForm';
import PaymentForm from './components/PaymentForm';
import LedgerView from './components/LedgerView';
import OverviewDashboard from './components/OverviewDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoanForm />} />
        <Route path="/pay" element={<PaymentForm />} />
        <Route path="/ledger/:loanId" element={<LedgerView />} />
        <Route path="/overview/:customerId" element={<OverviewDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
