import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import MandiBillingForm from '../components/billing/MandiBillingForm';
import MandiReceipt from '../components/print/MandiReceipt';
import BillSearchModal from '../components/billing/BillSearchModal';
import { 
  getInitialEmptyBill, 
  recalculateCompleteBill 
} from '../utils/mandiCalculations';
import { localDbService, initializeFreshDeployment } from '../db/mabDb';
import { excelBackupService } from '../services/excelBackupService';
import { triggerReliablePrint } from '../utils/printHelper';
import { 
  CheckCircle, 
  AlertCircle, 
  FileSpreadsheet, 
  Printer, 
  Settings2 
} from 'lucide-react';
import './BillingPage.css';

export default function BillingPage() {
  const [billData, setBillData] = useState(() => getInitialEmptyBill(1));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [billsList, setBillsList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Configurable Paper Size & Printer Settings
  const [printSettings, setPrintSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('mab_print_settings');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      paperSize: 'standard', // 'standard' (8-inch 203mm continuous) | 'thermal' (80mm) | 'custom'
      customWidthMm: 203,
      marginTopMm: 2,
      marginBottomMm: 2,
      marginLeftMm: 2,
      marginRightMm: 2,
      showGraphics: true,    // Produce Graphics toggle
      receiptSpacing: 'standard', // 'standard' | 'compact'
    };
  });

  const [showMarginControls, setShowMarginControls] = useState(false);

  // Update and persist print settings
  const updatePrintSettings = (updater) => {
    setPrintSettings((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      try {
        localStorage.setItem('mab_print_settings', JSON.stringify(next));
        localDbService.saveSetting('print_settings', next).catch(() => {});
      } catch (e) {}
      return next;
    });
  };

  const receiptPrintRef = useRef(null);

  // Show transient toast alert
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Load next available receipt number and settings on mount
  useEffect(() => {
    const init = async () => {
      // Initialize fresh production deployment state (clears old testing bills once)
      await initializeFreshDeployment();

      // Load print settings from Dexie
      const savedPrintSettings = await localDbService.getSetting('print_settings');
      if (savedPrintSettings) {
        setPrintSettings(savedPrintSettings);
      }

      // Check if editing existing bill passed via search params
      const editId = searchParams.get('editId');
      if (editId) {
        const existing = await localDbService.getBillById(editId);
        if (existing) {
          setBillData(recalculateCompleteBill(existing));
          showToast(`Receipt #${existing.receipt_no} loaded for editing.`);
          return;
        }
      }

      // Default: fetch next receipt number
      const nextNo = await localDbService.getNextReceiptNumber();
      setBillData((prev) => {
        if (!prev.farmer_name && prev.receipt_no === 1) {
          return { ...prev, receipt_no: nextNo };
        }
        return prev;
      });
    };

    init();
  }, [searchParams]);

  // Update top-level bill fields
  const handleBillDataChange = (field, value) => {
    setBillData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add a new row to the produce items table
  const handleAddItemRow = () => {
    setBillData((prev) => {
      const newRow = {
        id: `row-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        item_name: '',
        pishvi: 0,
        vajan: 0,
        bhav: 0,
        amount: 0,
        rupaye: 0,
        paise: 0,
      };
      const updated = {
        ...prev,
        items: [...prev.items, newRow],
      };
      return recalculateCompleteBill(updated);
    });
  };

  // Delete an item row
  const handleDeleteItemRow = (index) => {
    if (billData.items.length <= 1) {
      showToast('At least one item row is required.', 'error');
      return;
    }
    setBillData((prev) => {
      const updatedItems = prev.items.filter((_, idx) => idx !== index);
      return recalculateCompleteBill({ ...prev, items: updatedItems });
    });
  };

  // Change individual cell in an item row
  const handleChangeItemField = (index, field, value) => {
    setBillData((prev) => {
      const updatedItems = prev.items.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [field]: value === '' ? 0 : Number(value),
          };
        }
        return item;
      });
      return recalculateCompleteBill({ ...prev, items: updatedItems });
    });
  };

  // Change expense / deduction field
  const handleChangeExpenseField = (key, value) => {
    setBillData((prev) => {
      const updatedExpenses = {
        ...prev.expenses,
        [key]: value === '' ? 0 : Number(value),
      };
      return recalculateCompleteBill({ ...prev, expenses: updatedExpenses });
    });
  };

  // Save or update bill in IndexedDB
  const handleSaveBill = async () => {
    if (isSaving) return;

    if (!billData.farmer_name || billData.farmer_name.trim() === '') {
      showToast('Please enter customer name.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const isExisting = billData.id !== null && billData.id !== undefined && billData.id !== '';
      const saved = await localDbService.saveBill(billData);
      setBillData(saved);
      if (isExisting) {
        showToast(`Receipt #${saved.receipt_no} updated successfully!`);
      } else {
        showToast(`New receipt #${saved.receipt_no} saved successfully!`);
      }
    } catch (err) {
      console.error('Save error in Dexie:', err);
      showToast('Error saving receipt.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Create new bill
  const handleNewBill = async () => {
    setSearchParams({});
    const nextNo = await localDbService.getNextReceiptNumber();
    setBillData(getInitialEmptyBill(nextNo));
    showToast(`New receipt #${nextNo} initialized.`);
  };

  // Reset bill
  const handleResetBill = async () => {
    if (window.confirm('Are you sure you want to reset all entered details?')) {
      setSearchParams({});
      const nextNo = await localDbService.getNextReceiptNumber();
      setBillData(getInitialEmptyBill(nextNo));
      showToast('Form details have been reset.');
    }
  };

  // Ultra-reliable browser print trigger
  const handlePrint = async () => {
    try {
      showToast('Preparing printer...', 'success');
      await triggerReliablePrint(printSettings);
    } catch (err) {
      console.error('Print trigger error:', err);
      showToast('Printing error: ' + (err.message || 'Please try again'), 'error');
    }
  };

  // Download high-fidelity continuous tractor-feed PDF
  const handleSavePDF = async () => {
    const receiptElement = document.getElementById('mab-mandi-receipt');
    if (!receiptElement) {
      window.print();
      return;
    }

    try {
      showToast('Generating 8-inch continuous PDF...', 'success');
      if (document.fonts && document.fonts.ready) {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);
      }

      const targetWidthMm =
        printSettings.paperSize === 'thermal'
          ? 76
          : printSettings.paperSize === 'custom'
          ? (Number(printSettings.customWidthMm) || 203)
          : 203;

      // Ultra-sharp 3x high-DPI rasterization for crisp Marathi Devanagari text and borders
      const canvas = await html2canvas(receiptElement, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      // Calculate exact dynamic page height matching the content length (no A4 whitespace!)
      const pdfHeightMm = (canvas.height * targetWidthMm) / canvas.width;

      const isLandscape = targetWidthMm > pdfHeightMm;
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [Math.min(targetWidthMm, pdfHeightMm), Math.max(targetWidthMm, pdfHeightMm)],
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, targetWidthMm, pdfHeightMm, undefined, 'FAST');
      pdf.save(`MAB_Mandi_Patti_Rec_${String(billData.receipt_no || '1').padStart(4, '0')}.pdf`);
      showToast('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      window.print();
    }
  };

  // Export ALL bills history into formatted Excel file
  const handleExportExcel = async () => {
    showToast('Generating Excel backup...', 'success');
    try {
      const allBills = await localDbService.getAllBills();
      if (allBills.length === 0) {
        showToast('No bills available for backup.', 'error');
        return;
      }
      await excelBackupService.exportBackup(allBills);
      showToast('Excel file downloaded successfully!');
    } catch (err) {
      console.error('Excel Export error:', err);
      showToast('Error generating Excel file.', 'error');
    }
  };

  // Fetch search records
  const handleSearchQuery = async (search, date) => {
    setIsSearching(true);
    try {
      const records = await localDbService.getAllBills(search, date);
      setBillsList(records || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  // Load a selected bill into the editor for viewing/editing
  const handleSelectBill = (selected) => {
    setBillData(recalculateCompleteBill(selected));
    showToast(`Receipt #${selected.receipt_no} loaded for editing.`);
  };

  // Reprint an old bill directly
  const handleReprintBill = async (billToReprint) => {
    setBillData(recalculateCompleteBill(billToReprint));
    showToast(`Preparing receipt #${billToReprint.receipt_no} for printing...`);
    setTimeout(async () => {
      await triggerReliablePrint(printSettings);
    }, 200);
  };

  // Delete a bill record
  const handleDeleteBill = async (billToDelete) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete receipt #${billToDelete.receipt_no} (${billToDelete.farmer_name})?`
      )
    ) {
      try {
        await localDbService.deleteBill(billToDelete.id);
        setBillsList((prev) => prev.filter((b) => b.id !== billToDelete.id));
        showToast(`Receipt #${billToDelete.receipt_no} deleted successfully.`);
        if (billData.id === billToDelete.id) {
          handleNewBill();
        }
      } catch (err) {
        showToast('Error deleting receipt.', 'error');
      }
    }
  };

  return (
    <div className="billing-desktop-container">
      {/* NOTIFICATION TOAST */}
      {notification && (
        <div className={`notification-toast toast-${notification.type}`}>
          {notification.type === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* TOP STATUS BAR & GLOBAL ACTIONS */}
      <div className="billing-top-ribbon">
        <div className="ribbon-title-wrap">
          <span className="location-pill">Shri Siddheshwar Market Yard, Solapur</span>
          <h2>M.A.B TRADERS – Mandi Billing Application</h2>
          <div className="ribbon-contacts-bar">
            <span className="ribbon-contact-item">
              <span className="contact-person">Nehal:&nbsp;</span>9699485027
            </span>
            <span className="ribbon-contact-sep">|</span>
            <span className="ribbon-contact-item">
              <span className="contact-person">Faizan:&nbsp;</span>7083038821
            </span>
            <span className="ribbon-contact-sep">|</span>
            <span className="ribbon-contact-item">
              <span className="contact-person">Izhan:&nbsp;</span>9028342736
            </span>
            <span className="ribbon-contact-sep">|</span>
            <span className="ribbon-contact-item">
              <span className="contact-person">Muzammil:&nbsp;</span>9922559471
            </span>
          </div>
        </div>

        <div className="ribbon-actions-right">
          <button
            type="button"
            className="btn-ribbon-excel"
            onClick={handleExportExcel}
            title="Download complete billing records in Excel (.xlsx)"
          >
            <FileSpreadsheet size={16} />
            <span>Excel Export</span>
          </button>
          <span className="ribbon-date-text">
            Date: {new Date().toLocaleDateString('en-IN')}
          </span>
        </div>
      </div>

      {/* TWO-PANEL WORKSPACE */}
      <div className="two-panel-grid">
        {/* LEFT PANEL: Form entry */}
        <div className="left-panel-col">
          <MandiBillingForm
            billData={billData}
            onChangeBillData={handleBillDataChange}
            onAddItemRow={handleAddItemRow}
            onDeleteItemRow={handleDeleteItemRow}
            onChangeItemField={handleChangeItemField}
            onChangeExpenseField={handleChangeExpenseField}
            onSaveBill={handleSaveBill}
            onNewBill={handleNewBill}
            onResetBill={handleResetBill}
            onPrint={handlePrint}
            onSavePDF={handleSavePDF}
            onExportExcel={handleExportExcel}
            onOpenSearchModal={() => setIsSearchOpen(true)}
            isSaving={isSaving}
          />
        </div>

        {/* RIGHT PANEL: Live receipt preview with Paper Configuration */}
        <div className="right-panel-col">
          {/* Paper Size & Printing Settings Controls */}
          <div className="paper-settings-bar">
            <div className="settings-label-group">
              <Settings2 size={15} />
              <span>Paper Size:</span>
            </div>

            <div className="paper-size-buttons">
              <button
                type="button"
                className={`btn-paper-opt ${printSettings.paperSize === 'standard' ? 'active' : ''}`}
                onClick={() => updatePrintSettings({ paperSize: 'standard' })}
                title="Standard Mandi Continuous Paper (~8 inch / 203mm)"
              >
                📄 Standard 8"
              </button>

              <button
                type="button"
                className={`btn-paper-opt ${printSettings.paperSize === 'thermal' ? 'active' : ''}`}
                onClick={() => updatePrintSettings({ paperSize: 'thermal' })}
                title="80mm Thermal Roll Paper (POS)"
              >
                🧾 80mm Thermal
              </button>

              <button
                type="button"
                className={`btn-paper-opt ${printSettings.paperSize === 'custom' ? 'active' : ''}`}
                onClick={() => updatePrintSettings({ paperSize: 'custom' })}
                title="Custom Width in mm"
              >
                📐 Custom
              </button>
            </div>

            {/* Custom Width Input */}
            {printSettings.paperSize === 'custom' && (
              <div className="custom-width-wrap">
                <input
                  type="number"
                  min="50"
                  max="300"
                  value={printSettings.customWidthMm}
                  onChange={(e) =>
                    updatePrintSettings({ customWidthMm: Number(e.target.value) || 203 })
                  }
                  className="custom-width-input"
                  title="Paper width in mm"
                />
                <span className="unit-label">mm</span>
              </div>
            )}

            {/* Spacing Mode Toggle */}
            <div className="paper-size-buttons">
              <button
                type="button"
                className={`btn-paper-opt ${printSettings.receiptSpacing === 'standard' ? 'active' : ''}`}
                onClick={() => updatePrintSettings({ receiptSpacing: 'standard' })}
                title="Standard Spacing"
              >
                Standard
              </button>
              <button
                type="button"
                className={`btn-paper-opt ${printSettings.receiptSpacing === 'compact' ? 'active' : ''}`}
                onClick={() => updatePrintSettings({ receiptSpacing: 'compact' })}
                title="Compact Spacing"
              >
                Compact
              </button>
            </div>

            {/* Margins Toggle Button */}
            <button
              type="button"
              className={`btn-paper-opt ${showMarginControls ? 'active' : ''}`}
              onClick={() => setShowMarginControls((prev) => !prev)}
              title="Set Print Margins (mm)"
            >
              ⚙️ Margins
            </button>

            {/* Graphics Toggle for Dot-Matrix Mode */}
            <label
              className="graphics-toggle-label"
              title="Disable graphics for high-speed dot-matrix printing"
            >
              <input
                type="checkbox"
                checked={printSettings.showGraphics}
                onChange={(e) =>
                  updatePrintSettings({ showGraphics: e.target.checked })
                }
              />
              <span>Graphics</span>
            </label>
          </div>

          {/* Collapsible Margin Inputs Bar */}
          {showMarginControls && (
            <div className="margins-config-bar">
              <span className="margins-bar-title font-bold">Margins (mm):</span>
              <label className="margin-field">
                <span>Top:</span>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={printSettings.marginTopMm ?? 2}
                  onChange={(e) => updatePrintSettings({ marginTopMm: Number(e.target.value) || 0 })}
                  className="margin-input font-mono"
                />
              </label>
              <label className="margin-field">
                <span>Bottom:</span>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={printSettings.marginBottomMm ?? 2}
                  onChange={(e) => updatePrintSettings({ marginBottomMm: Number(e.target.value) || 0 })}
                  className="margin-input font-mono"
                />
              </label>
              <label className="margin-field">
                <span>Left:</span>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={printSettings.marginLeftMm ?? 2}
                  onChange={(e) => updatePrintSettings({ marginLeftMm: Number(e.target.value) || 0 })}
                  className="margin-input font-mono"
                />
              </label>
              <label className="margin-field">
                <span>Right:</span>
                <input
                  type="number"
                  min="0"
                  max="25"
                  value={printSettings.marginRightMm ?? 2}
                  onChange={(e) => updatePrintSettings({ marginRightMm: Number(e.target.value) || 0 })}
                  className="margin-input font-mono"
                />
              </label>
            </div>
          )}

          {/* Receipt Preview Top Header */}
          <div className="receipt-preview-header">
            <div className="preview-label-group">
              <span className="live-indicator-dot"></span>
              <span className="preview-heading">
                Live Receipt Preview (
                {printSettings.paperSize === 'thermal'
                  ? '80mm Thermal'
                  : printSettings.paperSize === 'custom'
                  ? `${printSettings.customWidthMm}mm Custom`
                  : '8" Continuous Paper'}
                )
              </span>
            </div>

            <div className="preview-quick-actions">
              <button
                type="button"
                className="btn-pill-print"
                onClick={handlePrint}
                title="Print Receipt"
              >
                <Printer size={13} style={{ display: 'inline', marginRight: '3px' }} />
                Print
              </button>
              <button
                type="button"
                className="btn-pill-pdf"
                onClick={handleSavePDF}
                title="Save as PDF"
              >
                PDF
              </button>
            </div>
          </div>

          {/* Printable Receipt Surface */}
          <div className="receipt-scroll-container">
            <MandiReceipt
              ref={receiptPrintRef}
              billData={billData}
              printSettings={printSettings}
            />
          </div>
        </div>
      </div>

      {/* SEARCH PREVIOUS BILLS MODAL */}
      <BillSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        billsList={billsList}
        isLoading={isSearching}
        onSearchQuery={handleSearchQuery}
        onSelectBill={handleSelectBill}
        onReprintBill={handleReprintBill}
        onDeleteBill={handleDeleteBill}
        onExportExcel={handleExportExcel}
      />
    </div>
  );
}
