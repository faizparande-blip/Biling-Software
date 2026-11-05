import React from 'react';
import './PrintReceipt.css';

export default function ReceiptTemplate({ title, children, receiptId = 'printable-receipt' }) {
  return (
    <div className="receipt-container" id={receiptId}>
      <div className="receipt-header">
        <h2>M.A.B TRADERS</h2>
        <p className="subtitle">Mandi Commission Agent & Produce Merchant</p>
        <p className="doc-title">{title}</p>
      </div>
      <div className="receipt-body">
        {children}
      </div>
      <div className="receipt-footer">
        <div className="sign-box">Signature of Party</div>
        <div className="sign-box">For M.A.B TRADERS</div>
      </div>
    </div>
  );
}
