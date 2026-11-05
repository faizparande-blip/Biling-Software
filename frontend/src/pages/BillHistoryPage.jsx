import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  Printer, 
  Calendar, 
  FileSpreadsheet, 
  History, 
  AlertCircle,
  FilePlus,
  ArrowRight
} from 'lucide-react';
import { localDbService } from '../db/mabDb';
import { excelBackupService } from '../services/excelBackupService';
import { triggerReliablePrint } from '../utils/printHelper';
import { useNavigate } from 'react-router-dom';
import './BillHistoryPage.css';

export default function BillHistoryPage({ onSelectBillToEdit }) {
  const [bills, setBills] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  const loadBills = async () => {
    setIsLoading(true);
    try {
      const records = await localDbService.getAllBills(search, filterDate);
      setBills(records);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, [search, filterDate]);

  // Edit Bill in Billing Desk
  const handleEditBill = (bill) => {
    if (onSelectBillToEdit) {
      onSelectBillToEdit(bill);
    }
    navigate('/');
  };

  // Reprint Bill Directly
  const handleReprint = async (bill) => {
    showToast(`Preparing receipt #${bill.receipt_no} for printing...`);
    if (onSelectBillToEdit) {
      onSelectBillToEdit(bill);
    }
    const settings = (await localDbService.getSetting('print_settings')) || {};
    setTimeout(async () => {
      await triggerReliablePrint(settings);
    }, 250);
  };

  // Delete Bill
  const handleDelete = async (bill) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete receipt #${bill.receipt_no} (${bill.farmer_name})?`
      )
    ) {
      await localDbService.deleteBill(bill.id);
      showToast(`Receipt #${bill.receipt_no} deleted successfully.`);
      loadBills();
    }
  };

  // Excel Export
  const handleExcelExport = async () => {
    if (bills.length === 0) {
      showToast('No bills available to export.');
      return;
    }
    showToast('Generating Excel backup...');
    await excelBackupService.exportBackup(bills);
    showToast('Excel backup downloaded successfully!');
  };

  const totalBags = bills.reduce((acc, b) => acc + (Number(b.total_pishvi) || 0), 0);
  const totalWeight = bills.reduce((acc, b) => acc + (Number(b.total_vajan) || 0), 0);
  const totalNet = bills.reduce((acc, b) => acc + (Number(b.net_payable) || 0), 0);

  return (
    <div className="history-page-container">
      {notification && (
        <div className="notification-toast toast-success">
          <span>{notification}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="history-header">
        <div className="header-left">
          <div className="history-icon-wrap">
            <History size={28} className="text-red" />
          </div>
          <div>
            <h2>Bill History & Register</h2>
            <p className="history-subtext">
              View, reprint, edit, or export all saved bills.
            </p>
          </div>
        </div>

        <div className="header-right">
          <button
            type="button"
            className="btn-history-excel"
            onClick={handleExcelExport}
            disabled={bills.length === 0}
          >
            <FileSpreadsheet size={16} />
            <span>Excel Export</span>
          </button>

          <button
            type="button"
            className="btn-history-new"
            onClick={() => navigate('/')}
          >
            <FilePlus size={16} />
            <span>New Bill</span>
          </button>
        </div>
      </div>

      {/* STATS TILES */}
      <div className="history-stats-row">
        <div className="stat-box">
          <span className="stat-box-lbl">Total Bills</span>
          <strong className="stat-box-val">{bills.length}</strong>
        </div>
        <div className="stat-box">
          <span className="stat-box-lbl">Total Bags</span>
          <strong className="stat-box-val">{totalBags}</strong>
        </div>
        <div className="stat-box">
          <span className="stat-box-lbl">Total Weight (kg)</span>
          <strong className="stat-box-val font-mono">{totalWeight.toFixed(2)}</strong>
        </div>
        <div className="stat-box highlight-net">
          <span className="stat-box-lbl">Total Net Payable</span>
          <strong className="stat-box-val font-mono">
            ₹{' '}
            {totalNet.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="history-filter-card">
        <div className="filter-input-wrap flex-2">
          <Search size={18} className="filter-search-icon" />
          <input
            type="text"
            placeholder="Search by receipt no., customer name, or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-search-input"
          />
        </div>

        <div className="filter-input-wrap flex-1">
          <Calendar size={18} className="filter-search-icon" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="filter-date-input"
          />
          {filterDate && (
            <button
              type="button"
              className="btn-clear-filter-date"
              onClick={() => setFilterDate('')}
              title="Clear date filter"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* RECORDS TABLE */}
      <div className="history-table-card">
        {isLoading ? (
          <div className="loading-state">Loading bills...</div>
        ) : bills.length > 0 ? (
          <div className="table-responsive-wrapper">
            <table className="history-data-table">
              <thead>
                <tr>
                  <th style={{ width: '10%' }}>Receipt No.</th>
                  <th style={{ width: '12%' }}>Date</th>
                  <th style={{ width: '26%' }}>Customer Name</th>
                  <th style={{ width: '16%' }}>Village</th>
                  <th style={{ width: '8%', textAlign: 'center' }}>Bags</th>
                  <th style={{ width: '14%', textAlign: 'right' }}>Net Amount</th>
                  <th style={{ width: '14%', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id || b.receipt_no}>
                    <td className="receipt-badge-cell">
                      #{String(b.receipt_no).padStart(2, '0')}
                    </td>
                    <td className="font-mono">{b.bill_date}</td>
                    <td className="farmer-name-text">{b.farmer_name}</td>
                    <td>{b.village || '—'}</td>
                    <td style={{ textAlign: 'center' }} className="font-mono">
                      {b.total_pishvi || 0}
                    </td>
                    <td className="net-amount-text font-mono">
                      ₹{' '}
                      {(Number(b.net_payable) || 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="table-action-cell">
                      <button
                        type="button"
                        className="btn-tbl-action btn-tbl-edit"
                        onClick={() => handleEditBill(b)}
                        title="Open and edit receipt"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="btn-tbl-action btn-tbl-print"
                        onClick={() => handleReprint(b)}
                        title="Print receipt"
                      >
                        <Printer size={14} />
                      </button>

                      <button
                        type="button"
                        className="btn-tbl-action btn-tbl-delete"
                        onClick={() => handleDelete(b)}
                        title="Delete receipt"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-history-state">
            <AlertCircle size={40} className="empty-icon" />
            <h3>No bills found</h3>
            <p>Try searching with a different term or create a new bill.</p>
            <button
              type="button"
              className="btn-create-first"
              onClick={() => navigate('/')}
            >
              Create New Bill
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
