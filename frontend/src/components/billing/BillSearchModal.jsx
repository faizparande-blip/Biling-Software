import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  Printer, 
  Calendar, 
  FileSpreadsheet, 
  X, 
  Eye 
} from 'lucide-react';
import './BillSearchModal.css';

export default function BillSearchModal({
  isOpen,
  onClose,
  onSelectBill,
  onReprintBill,
  onDeleteBill,
  onExportExcel,
  billsList = [],
  onSearchQuery,
  isLoading = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      onSearchQuery(searchTerm, filterDate);
    }
  }, [isOpen, searchTerm, filterDate]);

  if (!isOpen) return null;

  // Compute summary stats of current displayed bills
  const totalBagsCount = billsList.reduce(
    (acc, b) => acc + (Number(b.total_pishvi) || 0),
    0
  );
  const totalNetPayableSum = billsList.reduce(
    (acc, b) => acc + (Number(b.net_payable) || 0),
    0
  );

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-window" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="search-modal-header">
          <div>
            <h3>Bill History & Search</h3>
            <p className="search-modal-subtitle">
              Search and manage bills by receipt no., customer name, or date
            </p>
          </div>
          <div className="header-actions-right">
            <button
              type="button"
              className="btn-modal-excel"
              onClick={onExportExcel}
              title="Download all bills in Excel (.xlsx)"
            >
              <FileSpreadsheet size={16} />
              <span>Excel Export</span>
            </button>
            <button className="btn-modal-close" onClick={onClose} title="Close">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* SEARCH CONTROLS */}
        <div className="search-controls-bar">
          <div className="search-input-wrap flex-2">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by receipt no., customer name, or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoFocus
            />
          </div>

          <div className="search-input-wrap flex-1">
            <Calendar size={18} className="search-icon" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="search-input"
            />
            {filterDate && (
              <button
                type="button"
                className="btn-clear-date"
                onClick={() => setFilterDate('')}
                title="Clear date filter"
              >
                &times;
              </button>
            )}
          </div>
        </div>

        {/* BILLS LIST TABLE */}
        <div className="search-results-table-wrap">
          {isLoading ? (
            <div className="search-loading">Loading bills...</div>
          ) : billsList && billsList.length > 0 ? (
            <table className="bills-record-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Receipt No.</th>
                  <th style={{ width: '13%' }}>Date</th>
                  <th style={{ width: '25%' }}>Customer Name</th>
                  <th style={{ width: '15%' }}>Village</th>
                  <th style={{ width: '9%', textAlign: 'center' }}>Bags</th>
                  <th style={{ width: '14%', textAlign: 'right' }}>Net Payable</th>
                  <th style={{ width: '14%', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {billsList.map((bill) => (
                  <tr key={bill.id || bill.receipt_no}>
                    <td className="receipt-no-col">
                      #{String(bill.receipt_no).padStart(4, '0')}
                    </td>
                    <td className="font-mono">{bill.bill_date}</td>
                    <td className="farmer-name-cell">{bill.farmer_name}</td>
                    <td>{bill.village || '—'}</td>
                    <td style={{ textAlign: 'center' }} className="font-mono">
                      {bill.total_pishvi || 0}
                    </td>
                    <td className="net-payable-cell font-mono">
                      ₹{' '}
                      {(Number(bill.net_payable) || 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="action-buttons-cell">
                      <button
                        type="button"
                        className="btn-record-action btn-record-edit"
                        onClick={() => {
                          onSelectBill(bill);
                          onClose();
                        }}
                        title="Load and edit receipt"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="btn-record-action btn-record-reprint"
                        onClick={() => onReprintBill(bill)}
                        title="Reprint this receipt"
                      >
                        <Printer size={14} />
                      </button>

                      <button
                        type="button"
                        className="btn-record-action btn-record-delete"
                        onClick={() => onDeleteBill(bill)}
                        title="Delete receipt"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="search-no-results">
              <p>No bills found.</p>
              <span className="search-no-sub">
                Please search with a different keyword or receipt number.
              </span>
            </div>
          )}
        </div>

        {/* MODAL FOOTER WITH TOTALS */}
        <div className="search-modal-footer">
          <div className="footer-stats-group">
            <span className="results-count">
              Total Bills: <strong>{billsList.length}</strong>
            </span>
            <span className="stat-separator">•</span>
            <span>
              Total Bags: <strong>{totalBagsCount}</strong>
            </span>
            <span className="stat-separator">•</span>
            <span>
              Total Net Amount:{' '}
              <strong className="text-green">
                ₹{' '}
                {totalNetPayableSum.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-modal-excel-secondary"
              onClick={onExportExcel}
            >
              Download Excel
            </button>
            <button type="button" className="btn-close-modal" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
