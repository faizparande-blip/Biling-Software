import React from 'react';
import ReceiptTemplate from './ReceiptTemplate';

export default function JFormPrint({ bill, farmer, items = [] }) {
  return (
    <ReceiptTemplate title="J-FORM (FARMER SALE VOUCHER)" receiptId="jform-print">
      <div className="receipt-meta">
        <div><strong>Bill No:</strong> {bill?.bill_number || 'MAB/J/2026/0001'}</div>
        <div><strong>Date:</strong> {bill?.bill_date || '05/11/2026'}</div>
        <div><strong>Farmer:</strong> {farmer?.name || 'Ram Singh'}</div>
        <div><strong>Village:</strong> {farmer?.village_or_city || 'Kalyanpur'}</div>
      </div>
      <table className="receipt-items-table">
        <thead>
          <tr>
            <th>Commodity</th>
            <th>Bags</th>
            <th>Net Qtl</th>
            <th>Rate</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Wheat (Gehu)</td>
            <td>50</td>
            <td>25.00</td>
            <td>₹2,450</td>
            <td>₹61,250.00</td>
          </tr>
        </tbody>
      </table>
      <div className="receipt-totals">
        <div className="total-line">
          <span>Net Payable to Farmer:</span>
          <strong>₹61,250.00</strong>
        </div>
      </div>
    </ReceiptTemplate>
  );
}
