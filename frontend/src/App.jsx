import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import AppFooter from './components/common/AppFooter';
import AboutModal from './components/common/AboutModal';
import BillingPage from './pages/BillingPage';
import BillHistoryPage from './pages/BillHistoryPage';
import ExcelBackupPage from './pages/ExcelBackupPage';
import SettingsPage from './pages/SettingsPage';
import TestPrintPage from './pages/TestPrintPage';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import './styles/dashboard.css';
import './styles/billing.css';
import './styles/table.css';

export default function App() {
  const [billToEdit, setBillToEdit] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar onOpenAbout={() => setIsAboutOpen(true)} />
          <div className="app-main">
            <Sidebar onOpenAbout={() => setIsAboutOpen(true)} />
            <main className="app-content">
              <Routes>
                <Route path="/" element={<BillingPage initialBill={billToEdit} />} />
                <Route path="/billing" element={<BillingPage initialBill={billToEdit} />} />
                <Route 
                  path="/history" 
                  element={<BillHistoryPage onSelectBillToEdit={(b) => setBillToEdit(b)} />} 
                />
                <Route path="/backup" element={<ExcelBackupPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/test-print" element={<TestPrintPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
          <AppFooter onOpenAbout={() => setIsAboutOpen(true)} />
          <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        </div>
      </Router>
    </AuthProvider>
  );
}
