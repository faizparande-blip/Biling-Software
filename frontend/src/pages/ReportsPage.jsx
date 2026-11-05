import React from 'react';
import Header from '../components/common/Header';
import DailySalesReport from '../components/reports/DailySalesReport';
import MandiTaxReport from '../components/reports/MandiTaxReport';

export default function ReportsPage() {
  return (
    <div className="reports-page">
      <Header
        title="Reports & Analytics"
        subtitle="Mandi Tax (APMC) Register, Sales Journal & Excel Export"
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <DailySalesReport />
        <MandiTaxReport />
      </div>
    </div>
  );
}
