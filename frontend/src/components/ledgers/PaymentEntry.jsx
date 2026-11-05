import React from 'react';

export default function PaymentEntry() {
  return (
    <form className="payment-entry-form" onSubmit={(e) => e.preventDefault()}>
      <h4>Record Cash/Bank Voucher</h4>
      <div className="form-group">
        <label>Voucher Type</label>
        <select>
          <option value="credit">Receipt (Credit - Jama)</option>
          <option value="debit">Payment (Debit - Naam)</option>
        </select>
      </div>
      <div className="form-group">
        <label>Amount (₹)</label>
        <input type="number" placeholder="Enter transaction amount" />
      </div>
      <button type="submit" className="btn-primary">Post Voucher</button>
    </form>
  );
}
