import React from 'react';
import ReceiptTemplate from './ReceiptTemplate';

export default function IFormPrint({ bill, buyer, items = [] }) {
  return (
    <ReceiptTemplate title="I-FORM (BUYER PURCHASE INVOICE)" receiptId="iform-print">
      <div className="receipt-meta">
        <div><strong>Invoice No:</strong> {bill?.bill_number || 'MAB/I/2026/0001'}</div>
        <div><strong>Date:</strong> {bill?.bill_date || '05/11/2026'}</div>
        <div><strong>Buyer:</strong> {buyer?.name || 'Agro Mills Pvt Ltd'}</div>
        <div><strong>GSTIN:</strong> {buyer?.gstin || '08ABCDE1234F1Z5'}</div>
      </div>
      <table className="receipt-items-table">
        <thead>
          <tr>
            <th>Commodity</th>
            <th>Bags</th>
            <th>Net Qtl</th>
            <th>Rate</th>
            <th>Gross</th>
            <th>Mandi Tax</th>
            <th>Commission</th>
            <th>Net Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mustard (Sarson)</td>
            <td>100</td>
            <td>50.00</td>
            <td>₹5,200</td>
            <td>₹2,60,000</td>
            <td>₹2,600</td>
            <td>₹6,500</td>
            <td>₹2,69,100.00</td>
          </tr>
        </tbody>
      </table>
    </ReceiptTemplate>
  );
}
