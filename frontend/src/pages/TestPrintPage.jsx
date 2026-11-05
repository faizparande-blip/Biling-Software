import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import MandiReceipt from '../components/print/MandiReceipt';

export default function TestPrintPage() {
  const [searchParams] = useSearchParams();
  const rowsCount = parseInt(searchParams.get('rows') || '1', 10);
  const receiptRef = useRef(null);

  // Generate test items
  const items = [];
  let totalPishvi = 0;
  let totalVajan = 0;
  let grossAmount = 0;

  for (let i = 1; i <= rowsCount; i++) {
    const pishvi = 10 + (i % 5) * 5;
    const vajan = pishvi * 50;
    const bhav = 2000 + (i * 100);
    const amount = (vajan * bhav) / 100;
    totalPishvi += pishvi;
    totalVajan += vajan;
    grossAmount += amount;

    items.push({
      id: i,
      pishvi,
      vajan,
      bhav,
      amount,
      rupaye: Math.floor(amount),
      paise: 0,
    });
  }

  const expenses = {
    adat: Math.round(grossAmount * 0.03),
    hamali: totalPishvi * 8,
    tolai: totalPishvi * 4,
    stri_hamali: 36,
    levy: 12,
    motor_bhada: 0,
    warani: 25,
    rokh_uchal: 0,
    bardana: 0,
    itar: 0,
  };

  const totalDeductions = Object.values(expenses).reduce((sum, v) => sum + v, 0);
  const netPayable = grossAmount - totalDeductions;

  const billData = {
    receipt_no: 101,
    bill_date: '05/11/2026',
    farmer_name: 'अविनाश मारुती सावंत',
    account_no: 'SAV-289',
    village: 'मोहोळ, सोलापूर',
    items,
    expenses,
    total_pishvi: totalPishvi,
    total_vajan: totalVajan,
    gross_amount: grossAmount,
    total_deductions: totalDeductions,
    net_payable: netPayable,
  };

  const printSettings = {
    paperSize: 'standard',
    customWidthMm: 203,
    marginTopMm: 2,
    marginBottomMm: 2,
    marginLeftMm: 2,
    marginRightMm: 2,
    showGraphics: true,
    receiptSpacing: rowsCount > 10 ? 'compact' : 'standard',
  };

  // Dynamically calculate receipt height and inject exact @page size for continuous paper
  useEffect(() => {
    const el = document.getElementById('mab-mandi-receipt');
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const targetWidthMm = 203;
    const pxPerMm = rect.width > 0 ? rect.width / targetWidthMm : 3.78;
    const heightMm = Math.ceil(rect.height / pxPerMm) + 4;

    const styleId = 'test-print-dynamic-page-size';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      @page {
        size: ${targetWidthMm}mm ${heightMm}mm !important;
        margin: 2mm !important;
      }
      .test-hide-in-print {
        display: none !important;
      }
    `;
  }, [rowsCount]);

  return (
    <div style={{ padding: '10px 0', background: '#e2e8f0', minHeight: '100vh' }}>
      <h2 className="test-hide-in-print" style={{ textAlign: 'center', marginBottom: '8px', fontSize: '15px' }}>
        Test Print View: {rowsCount} Item Rows
      </h2>
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>
        <MandiReceipt ref={receiptRef} billData={billData} printSettings={printSettings} />
      </div>
    </div>
  );
}
