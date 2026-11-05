import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Printer,
  Building2,
  Calculator,
  Database,
  CheckCircle,
  Save,
  Info
} from 'lucide-react';
import { localDbService, DEFAULT_SETTINGS } from '../db/mabDb';
import './SettingsPage.css';

export default function SettingsPage() {
  const [printSettings, setPrintSettings] = useState(DEFAULT_SETTINGS.print_settings);
  const [billingSettings, setBillingSettings] = useState(DEFAULT_SETTINGS.billing_settings);
  const [notification, setNotification] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const loadSettings = async () => {
      const p = await localDbService.getSetting('print_settings');
      if (p) setPrintSettings(p);
      const b = await localDbService.getSetting('billing_settings');
      if (b) setBillingSettings(b);
    };
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await localDbService.saveSetting('print_settings', printSettings);
    await localDbService.saveSetting('billing_settings', billingSettings);
    setIsSaved(true);
    showToast('All settings saved successfully!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="settings-page-container">
      {notification && (
        <div className="notification-toast toast-success">
          <CheckCircle size={18} />
          <span>{notification}</span>
        </div>
      )}

      <div className="settings-header">
        <div className="settings-header-icon">
          <SettingsIcon size={30} className="text-red" />
        </div>
        <div>
          <h2>Application & Printer Settings</h2>
          <p className="settings-subtitle">
            Configure paper sizes, print margins, rate calculation methods, and business information.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="settings-form">
        {/* 1. PRINTER & PAPER SETTINGS */}
        <section className="settings-section-card">
          <div className="section-card-header">
            <Printer size={20} className="text-red" />
            <h3>1. Receipt & Printer Configuration</h3>
          </div>

          <div className="settings-grid">
            <div className="setting-field">
              <label>Primary Paper Size for Printing:</label>
              <select
                value={printSettings.paperSize}
                onChange={(e) =>
                  setPrintSettings((prev) => ({ ...prev, paperSize: e.target.value }))
                }
                className="select-input"
              >
                <option value="standard">📄 Standard 8-inch Continuous Paper (~203mm Dot-Matrix) [Recommended]</option>
                <option value="thermal">🧾 80mm POS Thermal Roll Paper</option>
                <option value="custom">📐 Custom Millimeter Width</option>
              </select>
              <span className="field-hint">
                For Mandi tractor-feed dot-matrix printers, select <strong>Standard 8-inch</strong>.
              </span>
            </div>

            {printSettings.paperSize === 'custom' && (
              <div className="setting-field">
                <label>Custom Width (Millimeters):</label>
                <input
                  type="number"
                  min="50"
                  max="300"
                  value={printSettings.customWidthMm}
                  onChange={(e) =>
                    setPrintSettings((prev) => ({
                      ...prev,
                      customWidthMm: Number(e.target.value) || 203,
                    }))
                  }
                  className="text-input font-mono"
                />
              </div>
            )}

            <div className="setting-field">
              <label>Margin Settings (mm):</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Top:</span>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={printSettings.marginTopMm ?? 2}
                    onChange={(e) =>
                      setPrintSettings((prev) => ({
                        ...prev,
                        marginTopMm: Number(e.target.value) || 0,
                      }))
                    }
                    className="text-input font-mono"
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Bottom:</span>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={printSettings.marginBottomMm ?? 2}
                    onChange={(e) =>
                      setPrintSettings((prev) => ({
                        ...prev,
                        marginBottomMm: Number(e.target.value) || 0,
                      }))
                    }
                    className="text-input font-mono"
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Left:</span>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={printSettings.marginLeftMm ?? 2}
                    onChange={(e) =>
                      setPrintSettings((prev) => ({
                        ...prev,
                        marginLeftMm: Number(e.target.value) || 0,
                      }))
                    }
                    className="text-input font-mono"
                  />
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Right:</span>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={printSettings.marginRightMm ?? 2}
                    onChange={(e) =>
                      setPrintSettings((prev) => ({
                        ...prev,
                        marginRightMm: Number(e.target.value) || 0,
                      }))
                    }
                    className="text-input font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="setting-field">
              <label>Receipt Line Spacing:</label>
              <select
                value={printSettings.receiptSpacing || 'standard'}
                onChange={(e) =>
                  setPrintSettings((prev) => ({ ...prev, receiptSpacing: e.target.value }))
                }
                className="select-input"
              >
                <option value="standard">Standard Spacing [Recommended]</option>
                <option value="compact">Compact Spacing (for multiple items)</option>
              </select>
            </div>

            <div className="setting-checkbox-field">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={printSettings.showGraphics}
                  onChange={(e) =>
                    setPrintSettings((prev) => ({ ...prev, showGraphics: e.target.checked }))
                  }
                />
                <span className="checkbox-label-text">
                  Show Produce Graphics on Receipt (Pomegranate & Onion)
                </span>
              </label>
              <span className="field-hint">
                You can disable this for faster text-only printing on dot-matrix ribbon printers.
              </span>
            </div>
          </div>

          {/* Windows Dot-Matrix Printer Driver Guide Accordion */}
          <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13.5px', color: '#0f172a', fontWeight: '800' }}>
              🖨️ How to configure 8-inch Continuous Paper in Windows for Dot-Matrix Printers
            </h4>
            <ol style={{ margin: '0', paddingLeft: '20px', fontSize: '12.5px', color: '#334155', lineHeight: '1.6' }}>
              <li>Open Windows Settings and navigate to <strong>Printers & Scanners</strong>.</li>
              <li>Select your Dot-Matrix / Tractor-Feed printer.</li>
              <li>Click <strong>Printing Preferences</strong> or <strong>Printer Properties</strong>.</li>
              <li>Under Paper / Form Size, select or create a <strong>Custom Paper Size</strong>: Width <strong>203 mm (8 inches)</strong>.</li>
              <li>Set Paper Type to <strong>Continuous Tractor-Feed</strong>.</li>
              <li>Select this paper size in your browser print dialog or printing options.</li>
              <li>In the browser print dialog, set Scale to <strong>Actual Size / 100%</strong> (turn off <em>Fit to Page / Shrink to Fit</em>) to preserve exact dimensions.</li>
            </ol>
          </div>
        </section>

        {/* 2. RATE CALCULATION BASIS */}
        <section className="settings-section-card">
          <div className="section-card-header">
            <Calculator size={20} className="text-emerald" />
            <h3>2. Rate Calculation Basis</h3>
          </div>

          <div className="settings-grid">
            <div className="setting-field">
              <label>Rate Calculation Formula:</label>
              <select
                value={billingSettings.defaultRateBasis}
                onChange={(e) =>
                  setBillingSettings((prev) => ({ ...prev, defaultRateBasis: e.target.value }))
                }
                className="select-input"
              >
                <option value="quintal">Rate per Quintal (Weight × Rate / 100) [Solapur APMC Standard]</option>
                <option value="10kg">Rate per 10 kg (Weight × Rate / 10)</option>
                <option value="bag">Rate per Bag (Total Bags × Rate)</option>
              </select>
              <span className="field-hint">
                In Solapur APMC, onion and produce rates are calculated <strong>per Quintal (100 kg)</strong>.
              </span>
            </div>

            <div className="setting-field">
              <label>Default Village / Town (Optional):</label>
              <input
                type="text"
                value={billingSettings.defaultVillage || ''}
                onChange={(e) =>
                  setBillingSettings((prev) => ({ ...prev, defaultVillage: e.target.value }))
                }
                placeholder="e.g. Mohol, Vairag, Barshi"
                className="text-input"
              />
            </div>
          </div>
        </section>

        {/* 3. BUSINESS INFORMATION DISPLAY */}
        <section className="settings-section-card">
          <div className="section-card-header">
            <Building2 size={20} className="text-blue" />
            <h3>3. Registered Business Information (M.A.B TRADERS)</h3>
          </div>

          <div className="business-info-display">
            <div className="info-row">
              <span className="info-title">Firm Name:</span>
              <strong className="info-data text-red">M.A.B TRADERS</strong>
            </div>
            <div className="info-row">
              <span className="info-title">Business Type:</span>
              <span className="info-data">
                Onion, Potato, Garlic, Groundnut, Fruits & Vegetables Commission Agent & Order Suppliers
              </span>
            </div>
            <div className="info-row">
              <span className="info-title">Address:</span>
              <span className="info-data">
                Shop No. C-7, E-58, Shri Siddheshwar Market Yard, Solapur (Maharashtra)
              </span>
            </div>
            <div className="info-row">
              <span className="info-title">Contact Numbers:</span>
              <span className="info-data">
                Nehal: 9699485027 | Faizan: 7083038821 | Izhan: 9028342736 | Muzammil: 9922559471
              </span>
            </div>
          </div>
        </section>

        {/* 4. ABOUT & DEVELOPER INFORMATION */}
        <section className="settings-section-card">
          <div className="section-card-header">
            <Info size={20} className="text-emerald" />
            <h3>4. About Application & Developer</h3>
          </div>

          <div className="business-info-display">
            <div className="info-row">
              <span className="info-title">Application:</span>
              <span className="info-data">
                M.A.B TRADERS Mandi Billing Application (APMC Solapur)
              </span>
            </div>
            <div className="info-row">
              <span className="info-title">Developer:</span>
              <strong className="info-data text-blue" style={{ fontSize: '14.5px' }}>
                Designed &amp; Developed by Faiz Parande
              </strong>
            </div>
            <div className="info-row">
              <span className="info-title">Contact:</span>
              <span className="info-data font-mono font-bold" style={{ fontSize: '14px', color: '#0f172a' }}>
                9699858890
              </span>
            </div>
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="settings-submit-bar">
          <button type="submit" className="btn-save-settings">
            <Save size={18} />
            <span>{isSaved ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
