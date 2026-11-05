import React, { useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Save, 
  Printer, 
  FileDown, 
  RotateCcw, 
  Search, 
  FilePlus, 
  FileSpreadsheet
} from 'lucide-react';
import './MandiBillingForm.css';

export default function MandiBillingForm({
  billData,
  onChangeBillData,
  onAddItemRow,
  onDeleteItemRow,
  onChangeItemField,
  onChangeExpenseField,
  onSaveBill,
  onNewBill,
  onResetBill,
  onPrint,
  onSavePDF,
  onExportExcel,
  onOpenSearchModal,
  isSaving = false,
}) {
  const {
    receipt_no,
    bill_date,
    farmer_name,
    account_no,
    village,
    items,
    expenses,
    total_pishvi,
    total_vajan,
    gross_amount,
    total_deductions,
    net_payable,
  } = billData;

  // Refs for seamless keyboard Enter-key navigation
  const billDateRef = useRef(null);
  const farmerNameRef = useRef(null);
  const villageRef = useRef(null);
  const accountNoRef = useRef(null);

  // 10 Standard Mandi Deductions in traditional order (Marathi labels preserved)
  const expenseInputs = [
    { key: 'adat', label: 'अडत (Commission)' },
    { key: 'hamali', label: 'हमाली (Hamali)' },
    { key: 'tolai', label: 'तोलाई (Weighing)' },
    { key: 'stri_hamali', label: 'स्त्री ह. (Stri Hamali)' },
    { key: 'levy', label: 'लेव्ही (Levy)' },
    { key: 'motor_bhada', label: 'मो. भाडा (Transport)' },
    { key: 'warani', label: 'वारणी (Warni)' },
    { key: 'rokh_uchal', label: 'रोख उचल (Cash Advance)' },
    { key: 'bardana', label: 'बारदाना (Bardana)' },
    { key: 'itar', label: 'इतर (Other Expenses)' },
  ];

  // Keyboard navigation handler for rapid entry
  const handleKeyDown = (e, nextTarget) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (typeof nextTarget === 'function') {
        nextTarget();
      } else if (nextTarget && nextTarget.current) {
        nextTarget.current.focus();
      }
    }
  };

  // Keyboard navigation inside item table
  const handleItemKeyDown = (e, rowIndex, fieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (fieldName === 'pishvi') {
        const nextInput = document.getElementById(`item-vajan-${rowIndex}`);
        if (nextInput) nextInput.focus();
      } else if (fieldName === 'vajan') {
        const nextInput = document.getElementById(`item-bhav-${rowIndex}`);
        if (nextInput) nextInput.focus();
      } else if (fieldName === 'bhav') {
        if (rowIndex === items.length - 1) {
          onAddItemRow();
          setTimeout(() => {
            const nextRowPishvi = document.getElementById(`item-pishvi-${rowIndex + 1}`);
            if (nextRowPishvi) nextRowPishvi.focus();
          }, 60);
        } else {
          const nextRowPishvi = document.getElementById(`item-pishvi-${rowIndex + 1}`);
          if (nextRowPishvi) nextRowPishvi.focus();
        }
      }
    }
  };

  return (
    <div className="billing-form-wrapper">
      {/* ACTION TOOLBAR AT THE TOP */}
      <div className="form-action-bar">
        <div className="action-group-left">
          <button
            type="button"
            className="btn-action btn-new"
            onClick={onNewBill}
            title="Create a new bill"
          >
            <FilePlus size={16} />
            <span>New Bill</span>
          </button>

          <button
            type="button"
            className="btn-action btn-search"
            onClick={onOpenSearchModal}
            title="Search previous bills"
          >
            <Search size={16} />
            <span>Search Bills</span>
          </button>

          <button
            type="button"
            className="btn-action btn-excel"
            onClick={onExportExcel}
            title="Export all bills to Excel (.xlsx)"
          >
            <FileSpreadsheet size={16} />
            <span>Excel Export</span>
          </button>
        </div>

        <div className="action-group-right">
          <button
            type="button"
            className="btn-action btn-reset"
            onClick={onResetBill}
            title="Reset current form"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            className="btn-action btn-print"
            onClick={onPrint}
            title="Print continuous dot-matrix or thermal receipt"
          >
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            className="btn-action btn-pdf"
            onClick={onSavePDF}
            title="Download continuous 8-inch PDF"
          >
            <FileDown size={16} />
            <span>Save PDF</span>
          </button>
        </div>
      </div>

      <form className="mandi-entry-form" onSubmit={(e) => e.preventDefault()}>
        {/* 1. BILL HEADER & CUSTOMER DETAILS */}
        <section className="form-section">
          <div className="section-title-bar">
            <h3>1. Bill & Customer Details</h3>
          </div>

          <div className="grid-3-col">
            <div className="field-box">
              <label htmlFor="receipt_no">
                Receipt Number <span className="req">*</span>
              </label>
              <input
                id="receipt_no"
                type="number"
                value={receipt_no || ''}
                onChange={(e) =>
                  onChangeBillData('receipt_no', e.target.value ? Number(e.target.value) : '')
                }
                onKeyDown={(e) => handleKeyDown(e, billDateRef)}
                className="input-large font-bold text-red"
                placeholder="e.g. 0001"
              />
            </div>

            <div className="field-box">
              <label htmlFor="bill_date">
                Date <span className="req">*</span>
              </label>
              <input
                id="bill_date"
                ref={billDateRef}
                type="text"
                value={bill_date || ''}
                onChange={(e) => onChangeBillData('bill_date', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, farmerNameRef)}
                className="input-large font-mono"
                placeholder="DD/MM/YYYY"
              />
            </div>

            <div className="field-box">
              <label htmlFor="account_no">
                Account / Ledger No.
              </label>
              <input
                id="account_no"
                ref={accountNoRef}
                type="text"
                value={account_no || ''}
                onChange={(e) => onChangeBillData('account_no', e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const firstPishvi = document.getElementById('item-pishvi-0');
                    if (firstPishvi) firstPishvi.focus();
                  }
                }}
                className="input-large"
                placeholder="e.g. A-12"
              />
            </div>
          </div>

          <div className="grid-2-col" style={{ marginTop: '12px' }}>
            <div className="field-box">
              <label htmlFor="farmer_name">
                Customer / Farmer Name <span className="req">*</span>
              </label>
              <input
                id="farmer_name"
                ref={farmerNameRef}
                type="text"
                value={farmer_name || ''}
                onChange={(e) => onChangeBillData('farmer_name', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, villageRef)}
                className="input-large font-bold"
                placeholder="Enter full name of farmer / customer"
              />
            </div>

            <div className="field-box">
              <label htmlFor="village">
                Village / Town
              </label>
              <input
                id="village"
                ref={villageRef}
                type="text"
                value={village || ''}
                onChange={(e) => onChangeBillData('village', e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, accountNoRef)}
                className="input-large"
                placeholder="e.g. Mohol, Solapur"
              />
            </div>
          </div>
        </section>

        {/* 2. PRODUCE LOTS & WEIGHMENT */}
        <section className="form-section">
          <div className="section-title-bar flex-between">
            <div>
              <h3>2. Produce Lots & Weighment</h3>
              <p className="section-hint">
                Formula: Amount = (Weight × Rate) / 100 (Press Enter to jump to the next field)
              </p>
            </div>
            <button
              type="button"
              className="btn-add-row"
              onClick={onAddItemRow}
              title="Add a new item row (or press Enter in the Rate field)"
            >
              <Plus size={16} />
              <span>Add New Row</span>
            </button>
          </div>

          <div className="items-table-wrapper">
            <table className="form-items-table">
              <thead>
                <tr>
                  <th style={{ width: '5%', textAlign: 'center' }}>Sr.</th>
                  <th style={{ width: '18%' }}>Bags (पिशवी)</th>
                  <th style={{ width: '22%' }}>Weight (kg)</th>
                  <th style={{ width: '22%' }}>Rate (₹ per Qtl)</th>
                  <th style={{ width: '25%', textAlign: 'right' }}>Total Amount (₹)</th>
                  <th style={{ width: '8%', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items && items.length > 0 ? (
                  items.map((row, index) => {
                    const rupaye =
                      row.rupaye !== undefined ? row.rupaye : Math.floor(row.amount || 0);
                    const paise =
                      row.paise !== undefined
                        ? String(row.paise).padStart(2, '0')
                        : String(Math.round(((row.amount || 0) - rupaye) * 100)).padStart(2, '0');

                    return (
                      <tr key={row.id || index}>
                        <td className="row-num">{index + 1}</td>
                        <td>
                          <input
                            id={`item-pishvi-${index}`}
                            type="number"
                            min="0"
                            value={row.pishvi === 0 ? '' : row.pishvi}
                            onChange={(e) =>
                              onChangeItemField(index, 'pishvi', e.target.value)
                            }
                            onKeyDown={(e) => handleItemKeyDown(e, index, 'pishvi')}
                            placeholder="0"
                            className="input-cell"
                          />
                        </td>
                        <td>
                          <input
                            id={`item-vajan-${index}`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={row.vajan === 0 ? '' : row.vajan}
                            onChange={(e) =>
                              onChangeItemField(index, 'vajan', e.target.value)
                            }
                            onKeyDown={(e) => handleItemKeyDown(e, index, 'vajan')}
                            placeholder="0.00"
                            className="input-cell font-bold"
                          />
                        </td>
                        <td>
                          <input
                            id={`item-bhav-${index}`}
                            type="number"
                            step="1"
                            min="0"
                            value={row.bhav === 0 ? '' : row.bhav}
                            onChange={(e) =>
                              onChangeItemField(index, 'bhav', e.target.value)
                            }
                            onKeyDown={(e) => handleItemKeyDown(e, index, 'bhav')}
                            placeholder="₹ Rate"
                            className="input-cell font-bold"
                          />
                        </td>
                        <td className="amount-preview-cell font-mono">
                          ₹{' '}
                          {(Number(row.amount) || 0).toLocaleString('en-IN', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn-delete-row"
                            onClick={() => onDeleteItemRow(index)}
                            disabled={items.length <= 1}
                            title="Remove this row"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '16px' }}>
                      Please click 'Add New Row' to add produce items
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="tfoot-summary-row">
                  <td className="font-bold">Total:</td>
                  <td className="font-bold">{total_pishvi} Bags</td>
                  <td className="font-bold">{(Number(total_vajan) || 0).toFixed(2)} kg</td>
                  <td style={{ textAlign: 'right' }}>Gross Amount:</td>
                  <td className="font-bold amount-total-highlight font-mono" style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    ₹{' '}
                    {(Number(gross_amount) || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* 3. MANDI DEDUCTIONS - वजा खर्च */}
        <section className="form-section">
          <div className="section-title-bar flex-between">
            <h3>3. Mandi Deductions & Expenses (वजा खर्च)</h3>
            <span className="deduction-badge-header">
              Total Deductions: ₹{' '}
              {(Number(total_deductions) || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="expenses-form-grid">
            {expenseInputs.map((exp) => (
              <div key={exp.key} className="expense-input-box">
                <label htmlFor={`exp-${exp.key}`}>{exp.label}</label>
                <div className="currency-input-wrap">
                  <span className="currency-prefix">₹</span>
                  <input
                    id={`exp-${exp.key}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={expenses[exp.key] === 0 ? '' : expenses[exp.key]}
                    onChange={(e) => onChangeExpenseField(exp.key, e.target.value)}
                    placeholder="0.00"
                    className="expense-input font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. FINAL CALCULATION SUMMARY */}
        <section className="form-section final-summary-section">
          <div className="section-title-bar">
            <h3>4. Final Settlement Summary</h3>
          </div>

          <div className="summary-cards-row">
            <div className="summary-card">
              <span className="card-lbl">Total Bags</span>
              <span className="card-val">{total_pishvi}</span>
            </div>
            <div className="summary-card">
              <span className="card-lbl">Total Weight (kg)</span>
              <span className="card-val">{(Number(total_vajan) || 0).toFixed(2)}</span>
            </div>
            <div className="summary-card">
              <span className="card-lbl">Gross Amount</span>
              <span className="card-val font-blue font-mono" style={{ whiteSpace: 'nowrap' }}>
                ₹{' '}
                {(Number(gross_amount) || 0).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="summary-card">
              <span className="card-lbl">Total Deductions</span>
              <span className="card-val font-red font-mono" style={{ whiteSpace: 'nowrap' }}>
                - ₹{' '}
                {(Number(total_deductions) || 0).toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          <div className="final-payable-banner">
            <div className="payable-text-col">
              <span className="banner-subtitle">Cash Payable to Customer / Farmer</span>
              <span className="banner-title">Net Payable Amount</span>
            </div>
            <div className="payable-amount-col font-mono" style={{ whiteSpace: 'nowrap' }}>
              ₹ {(Number(net_payable) || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        </section>

        {/* 5. FORM SUBMISSION BAR (Absolute bottom of the billing form) */}
        <div className="form-bottom-action-bar">
          <button
            type="button"
            className="btn-bottom-save"
            onClick={onSaveBill}
            disabled={isSaving}
            title="Save bill permanently to database"
          >
            <Save size={20} className={isSaving ? 'save-spinner-icon' : ''} />
            <span>{isSaving ? 'Saving Bill...' : 'Save Bill'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
