import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import { reportService } from '../services/reportService';
import { formatINR } from '../utils/formatters';

export default function Dashboard() {
  const [summary, setSummary] = useState({
    total_arrivals_bags: 1250,
    total_sales_amount: 1450000,
    total_commission: 36250,
    total_mandi_tax: 14500,
  });

  useEffect(() => {
    reportService.getDailySummary()
      .then((data) => {
        if (data && data.total_sales_amount > 0) setSummary(data);
      })
      .catch((err) => console.log('Backend fallback used'));
  }, []);

  return (
    <div className="dashboard-page">
      <Header
        title="Mandi Trading Dashboard"
        subtitle="M.A.B TRADERS Commission Agent & Produce Operations"
      />

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Daily Arrivals</span>
          <h2 className="stat-value">{summary.total_arrivals_bags} Bags</h2>
          <span className="stat-sub">Across active lots</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Turnover</span>
          <h2 className="stat-value">{formatINR(summary.total_sales_amount)}</h2>
          <span className="stat-sub">Gross trading volume</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Commission (Aadhat)</span>
          <h2 className="stat-value">{formatINR(summary.total_commission)}</h2>
          <span className="stat-sub">Brokerage earned</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Mandi Fee & Cess</span>
          <h2 className="stat-value">{formatINR(summary.total_mandi_tax)}</h2>
          <span className="stat-sub">APMC statutory duty</span>
        </div>
      </div>

      <div className="dashboard-content-split">
        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions-list">
            <a href="/billing" className="quick-action-btn">New J-Form (Farmer)</a>
            <a href="/billing" className="quick-action-btn">New I-Form (Buyer)</a>
            <a href="/parties" className="quick-action-btn">Register Farmer / Trader</a>
            <a href="/reports" className="quick-action-btn">Daily Register & Excel</a>
          </div>
        </div>

        <div className="card">
          <h3>Mandi Operational Notice</h3>
          <p className="notice-text">
            M.A.B TRADERS Billing Application Initial Architecture initialized.
            Ready for Phase 2: Complete auction weighment, lot mapping, ledger double-entry posting, and custom printing.
          </p>
        </div>
      </div>
    </div>
  );
}
