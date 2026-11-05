import React, { useState, useEffect, useRef } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Database, 
  RefreshCw 
} from 'lucide-react';
import { localDbService } from '../db/mabDb';
import { excelBackupService } from '../services/excelBackupService';
import './ExcelBackupPage.css';

export default function ExcelBackupPage() {
  const [billsCount, setBillsCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadStats = async () => {
    try {
      const all = await localDbService.getAllBills();
      setBillsCount(all.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Export Backup Handler
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const bills = await localDbService.getAllBills();
      if (bills.length === 0) {
        showToast('No bills available for backup. Please create a bill first.', 'error');
        return;
      }
      const res = await excelBackupService.exportBackup(bills);
      showToast(`Success! Backup of ${res.count} bills saved to '${res.filename}'.`);
    } catch (err) {
      console.error(err);
      showToast(`Error generating backup: ${err.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Restore Backup Handler
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm(`Are you sure you want to restore bills from '${file.name}'?`)) {
      e.target.value = '';
      return;
    }

    setIsRestoring(true);
    try {
      const restoredBills = await excelBackupService.restoreBackup(file);
      
      const overwrite = window.confirm(
        `Found ${restoredBills.length} bills in file.\n\n` +
        `Click 'OK' to merge with existing records.\n` +
        `Click 'Cancel' to abort.`
      );

      if (overwrite === null) {
        return;
      }

      await localDbService.restoreBills(restoredBills, false);
      await loadStats();
      showToast(`Success! ${restoredBills.length} bills restored successfully.`);
    } catch (err) {
      console.error(err);
      showToast(`Restore error: ${err.message}`, 'error');
    } finally {
      setIsRestoring(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="backup-page-container">
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`notification-toast toast-${notification.type}`}>
          {notification.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertTriangle size={18} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* HEADER RIBBON */}
      <div className="backup-header-card">
        <div className="header-icon-wrap">
          <FileSpreadsheet size={32} className="text-emerald" />
        </div>
        <div>
          <h2>Excel Backup & Data Management</h2>
          <p className="backup-subtext">
            Safely download an Excel (.xlsx) backup of all bills or restore records from a previous backup file.
          </p>
        </div>
      </div>

      {/* REGULAR BACKUP REMINDER BANNER */}
      <div className="reminder-banner">
        <Info size={22} className="reminder-icon" />
        <div className="reminder-content">
          <strong>Important Backup Reminder:</strong>
          <p>
            M.A.B TRADERS stores all billing data directly in your device's browser memory (IndexedDB) with zero server dependence.
            To safeguard against accidental browser history clearance or device issues, <strong>regularly download an Excel backup (weekly or monthly) and keep a copy on a pendrive or email.</strong>
          </p>
        </div>
      </div>

      {/* DEVICE-LOCAL DATA STORAGE LIMITATION NOTICE */}
      <div className="device-notice-card">
        <Database size={20} className="notice-icon" />
        <div>
          <strong>Notice: Device-Local Data Storage</strong>
          <p>
            Data is stored locally on each device. To transfer bills between mobile and laptop: export an Excel backup on the source device and use <em>'Restore from Excel Backup'</em> on the destination device.
          </p>
        </div>
      </div>

      {/* MAIN ACTIONS GRID */}
      <div className="backup-actions-grid">
        {/* ACTION 1: EXPORT */}
        <div className="action-card export-card">
          <div className="card-badge">Step 1</div>
          <div className="card-top-icon">
            <Download size={36} className="text-emerald" />
          </div>
          <h3>Download Excel Backup</h3>
          <p className="card-desc">
            Download complete multi-sheet Excel (.xlsx) backup including bill summaries, itemized produce bags, weights, rates, and detailed expense deductions for all <strong>{billsCount}</strong> saved bills.
          </p>
          <div className="card-meta">
            <span>Total Bills Available: <strong>{billsCount}</strong></span>
          </div>
          <button
            type="button"
            className="btn-backup-action btn-export"
            onClick={handleExport}
            disabled={isExporting || billsCount === 0}
          >
            <FileSpreadsheet size={18} />
            <span>{isExporting ? 'Generating Backup...' : 'Export Excel Backup'}</span>
          </button>
        </div>

        {/* ACTION 2: RESTORE */}
        <div className="action-card restore-card">
          <div className="card-badge">Step 2</div>
          <div className="card-top-icon">
            <Upload size={36} className="text-blue" />
          </div>
          <h3>Restore from Excel Backup</h3>
          <p className="card-desc">
            Select a previously exported M.A.B TRADERS Excel backup file (.xlsx) to restore billing records into this application.
          </p>
          <div className="card-meta">
            <span>Accepted Format: <strong>.xlsx</strong></span>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="btn-backup-action btn-restore"
            onClick={() => fileInputRef.current?.click()}
            disabled={isRestoring}
          >
            <Upload size={18} />
            <span>{isRestoring ? 'Restoring Records...' : 'Restore from Excel Backup'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
