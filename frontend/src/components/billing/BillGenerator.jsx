import React, { useState } from 'react';

export default function BillGenerator() {
  const [billType, setBillType] = useState('J-FORM');

  return (
    <div className="bill-generator-card">
      <div className="tab-switch">
        <button
          className={billType === 'J-FORM' ? 'active' : ''}
          onClick={() => setBillType('J-FORM')}
        >
          J-Form (Kisan / Farmer Bill)
        </button>
        <button
          className={billType === 'I-FORM' ? 'active' : ''}
          onClick={() => setBillType('I-FORM')}
        >
          I-Form (Vyapari / Buyer Invoice)
        </button>
      </div>

      <div className="form-placeholder">
        <p>Billing generator form ready for Phase 2 implementation.</p>
      </div>
    </div>
  );
}
