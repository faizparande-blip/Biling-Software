import React, { forwardRef } from 'react';
import { MabLogoGraphic, OnionGraphic } from './ProduceGraphics';
import './MandiReceipt.css';

/**
 * Authentic Maharashtra APMC Mandi Billing Slip (मंडी पावती / पट्टी)
 * Recreated with traditional dot-matrix continuous tractor-feed proportions.
 *
 * Architecture & Alignment:
 * 1. Primary Target: 8-inch (~203mm) Continuous Paper with dynamic height.
 * 2. Unbroken Vertical Divider: 58% (Left Lots & Farmer Signature) / 42% (Right Expenses & Settlement).
 * 3. Clear Typography: Prominent Marathi & English business titles, right-aligned numbers.
 * 4. Dot-matrix ribbon optimization: Crisp black borders and no background tinting in print.
 */

const MandiReceipt = forwardRef(({ billData, printSettings = {} }, ref) => {
  const {
    receipt_no = 1,
    bill_date = '',
    farmer_name = '',
    account_no = '',
    village = '',
    items = [],
    expenses = {},
    total_pishvi = 0,
    total_vajan = 0,
    gross_amount = 0,
    total_deductions = 0,
    net_payable = 0,
  } = billData || {};

  const {
    paperSize = 'standard', // 'standard' (8-inch 203mm), 'thermal' (80mm), 'custom'
    customWidthMm = 203,
    showGraphics = true,    // Produce Graphics toggle
    receiptSpacing = 'standard', // 'standard' | 'compact'
  } = printSettings;

  // 10 Standard APMC Expense Fields in traditional Mandi sequence
  const expenseFields = [
    { key: 'adat', label: 'अडत' },
    { key: 'hamali', label: 'हमाली' },
    { key: 'tolai', label: 'तोलाई' },
    { key: 'stri_hamali', label: 'स्त्री ह.' },
    { key: 'levy', label: 'लेव्ही' },
    { key: 'motor_bhada', label: 'मो. भाडा' },
    { key: 'warani', label: 'वारणी' },
    { key: 'rokh_uchal', label: 'रोख उचल' },
    { key: 'bardana', label: 'बारदाना' },
    { key: 'itar', label: 'इतर' },
  ];

  // Derive paper class
  const paperClass =
    paperSize === 'thermal'
      ? 'paper-thermal-80mm'
      : paperSize === 'custom'
      ? 'paper-custom'
      : 'paper-standard-8in';

  const spacingClass = receiptSpacing === 'compact' ? 'spacing-compact' : 'spacing-standard';

  const customPaperStyle =
    paperSize === 'custom'
      ? { width: `${customWidthMm || 203}mm`, maxWidth: `${customWidthMm || 203}mm` }
      : {};

  // Split gross amount and deductions into Rupees and Paise
  const grossRupaye = Math.floor(gross_amount || 0);
  const grossPaise = String(Math.round(((gross_amount || 0) - grossRupaye) * 100)).padStart(2, '0');

  const dedRupaye = Math.floor(total_deductions || 0);
  const dedPaise = String(Math.round(((total_deductions || 0) - dedRupaye) * 100)).padStart(2, '0');

  const netRupaye = Math.round(net_payable || 0);

  // Compute item count to adjust blank space height dynamically
  const itemCount = items ? items.length : 0;
  const blankSpaceClass =
    itemCount >= 12
      ? 'blank-zero'
      : itemCount >= 8
      ? 'blank-minimized'
      : itemCount >= 4
      ? 'blank-medium'
      : 'blank-spacious';

  // Dynamic sprocket count that scales proportionally with receipt height
  const sprocketCount = Math.max(32, Math.min(90, Math.floor(itemCount * 3) + 26));

  return (
    <div className={`mandi-patti-wrapper ${paperClass} ${spacingClass}`}>
      {/* Visual tractor-feed sprocket perforations for continuous form realism */}
      <div className="tractor-feed-sprocket sprocket-left" aria-hidden="true">
        {[...Array(sprocketCount)].map((_, i) => (
          <span key={`l-${i}`} className="sprocket-hole"></span>
        ))}
      </div>

      <div
        className={`mandi-receipt-printable ${paperClass} ${spacingClass}`}
        ref={ref}
        id="mab-mandi-receipt"
        style={customPaperStyle}
      >
        {/* =========================================================================
            1. HEADER SECTION
            Upper-Left: All 5 Contact Numbers (Prominent & cleanly aligned)
            Center: MAB seal, Marathi & English firm branding, address
            Top-Right: Onion (कांदा) graphic (Pomegranate completely removed)
            ========================================================================= */}
        <div className="receipt-header-container">
          <div className="header-branding-row">
            {/* Upper-Left Section: Business Contact Numbers */}
            <div className="header-contacts-left">
              <div className="contact-entry">
                <span className="contact-name">Nehal:</span>
                <span className="contact-num font-mono">9699485027</span>
              </div>
              <div className="contact-entry">
                <span className="contact-name">Faizan:</span>
                <span className="contact-num font-mono">7083038821</span>
              </div>
              <div className="contact-entry">
                <span className="contact-name">Izhan:</span>
                <span className="contact-num font-mono">9028342736</span>
              </div>
              <div className="contact-entry">
                <span className="contact-name">Muzammil:</span>
                <span className="contact-num font-mono">9922559471</span>
              </div>
            </div>

            {/* Center Branding Block */}
            <div className="branding-center-block">
              {showGraphics && (
                <div className="mab-center-seal">
                  <MabLogoGraphic size={paperSize === 'thermal' ? 30 : 36} />
                </div>
              )}
              <div className="marathi-firm-name">एम.ए.बी. ट्रेडर्स</div>
              <h1 className="english-firm-name">M.A.B TRADERS</h1>
              <div className="firm-subtitle">
                कांदा, बटाटे, लसूण, व शेंगा, फ्रूट अॅन्ड व्हेजीटेबल कमिशन एजंट ऑर्डर सप्लायर्स
              </div>
              <div className="firm-address">
                गाळा नं. सी - ७, ई - ५८, श्री सिध्देश्वर मार्केट यार्ड, सोलापूर (महाराष्ट्र)
              </div>
            </div>

            {/* Top-Right: Onion Graphic (Pomegranate completely removed) */}
            {showGraphics && (
              <div className="branding-graphic-right" title="कांदा">
                <OnionGraphic size={paperSize === 'thermal' ? 38 : 52} />
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            2. RECEIPT METADATA (पावती क्र., दिनांक, मालधनीचे नांव, व.नं., गांव)
            ========================================================================= */}
        <div className="receipt-metadata-grid">
          <div className="meta-row meta-row-top">
            <div className="meta-cell meta-no">
              <span className="meta-label">पावती क्र.</span>
              <span className="meta-val receipt-number-badge font-mono">
                #{String(receipt_no || 1).padStart(2, '0')}
              </span>
            </div>
            <div className="meta-cell meta-date">
              <span className="meta-label">दिनांक :</span>
              <span className="meta-val font-mono">{bill_date || '—'}</span>
            </div>
          </div>

          <div className="meta-row meta-row-farmer">
            <div className="meta-cell meta-farmer full-width">
              <span className="meta-label">मालधनीचे नांव :</span>
              <span className="meta-dots-wrap">
                <span className="meta-val farmer-name-bold">
                  {farmer_name || '..................................................................'}
                </span>
              </span>
            </div>
          </div>

          <div className="meta-row meta-row-bottom">
            <div className="meta-cell meta-ac">
              <span className="meta-label">व. नं. :</span>
              <span className="meta-val font-mono">{account_no || '—'}</span>
            </div>
            <div className="meta-cell meta-village">
              <span className="meta-label">गांव :</span>
              <span className="meta-val">{village || '—'}</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. MAIN BILLING TABLE: UNBROKEN TWO-COLUMN SPLIT
            Left (58%): Produce Lots + Subtotal
            Right (42%): 10 Standard APMC Deductions + Subtotal
            ========================================================================= */}
        <div className="mandi-two-column-table">
          {/* ---------------- LEFT SECTION (ITEMS) ---------------- */}
          <div className="table-col-left-items">
            {/* Header Row */}
            <div className="items-header-bar">
              <div className="th-cell col-pishvi">कांदा पिशवी</div>
              <div className="th-cell col-vajan">वजन</div>
              <div className="th-cell col-bhav">भाव</div>
              <div className="th-cell col-ekun">
                <div className="ekun-title">एकूण</div>
                <div className="ekun-sub">
                  <span className="sub-rupaye">रुपये</span>
                  <span className="sub-paise">पैसे</span>
                </div>
              </div>
            </div>

            {/* Item Rows - Compact, zero dotted lines, seamlessly stacked directly below each other */}
            <div className="items-rows-container">
              {items && items.length > 0 ? (
                items.map((item, idx) => {
                  const rupayeVal =
                    item.rupaye !== undefined ? item.rupaye : Math.floor(item.amount || 0);
                  const paiseVal =
                    item.paise !== undefined
                      ? String(item.paise).padStart(2, '0')
                      : String(Math.round(((item.amount || 0) - rupayeVal) * 100)).padStart(2, '0');

                  return (
                    <div className="item-data-row" key={item.id || idx}>
                      <div className="td-cell col-pishvi font-mono">{item.pishvi || 0}</div>
                      <div className="td-cell col-vajan font-mono">
                        {(Number(item.vajan) || 0).toFixed(0)}
                      </div>
                      <div className="td-cell col-bhav font-mono">
                        {(Number(item.bhav) || 0).toFixed(0)}
                      </div>
                      <div className="td-cell col-ekun font-mono">
                        <span className="amount-rupaye">
                          {(Number(rupayeVal) || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="amount-sep">.</span>
                        <span className="amount-paise">{paiseVal}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-items-notice">मालाचा तपशील प्रविष्ट करा</div>
              )}
            </div>

            {/* BLANK WRITING SPACE (Dynamic height - minimizes when items >= 12) */}
            <div className={`blank-writing-area ${blankSpaceClass}`}>
              {itemCount < 8 && (
                <div className="faint-bg-watermark" aria-hidden="true">
                  MAB
                </div>
              )}
            </div>

            {/* Left Subtotal Row */}
            <div className="left-subtotal-bar">
              <div className="sub-cell col-pishvi font-mono font-bold">{total_pishvi}</div>
              <div className="sub-cell col-vajan font-mono font-bold">
                {(Number(total_vajan) || 0).toFixed(0)}
              </div>
              <div className="sub-cell col-bhav font-bold label-center">एकूण</div>
              <div className="sub-cell col-ekun font-mono font-bold">
                <span className="amount-rupaye">{grossRupaye.toLocaleString('en-IN')}</span>
                <span className="amount-sep">.</span>
                <span className="amount-paise">{grossPaise}</span>
              </div>
            </div>
          </div>

          {/* ---------------- RIGHT SECTION (EXPENSES) ---------------- */}
          <div className="table-col-right-expenses">
            {/* Expense Header Row */}
            <div className="expenses-header-bar">
              <div className="th-cell col-exp-name">कपात / खर्च</div>
              <div className="th-cell col-exp-amount">
                <span className="sub-rupaye">रुपये</span>
                <span className="sub-paise">पैसे</span>
              </div>
            </div>

            {/* 10 Standard APMC Mandi Deductions */}
            <div className="expenses-rows-container">
              {expenseFields.map((exp) => {
                const val = Number(expenses[exp.key] || 0);
                const hasValue = val > 0;
                const rVal = Math.floor(val);
                const pVal = String(Math.round((val - rVal) * 100)).padStart(2, '0');

                return (
                  <div className="expense-row-item" key={exp.key}>
                    <div className="td-cell col-exp-name">{exp.label}</div>
                    <div className="td-cell col-exp-amount font-mono">
                      {hasValue ? (
                        <>
                          <span className="exp-rupaye">{rVal.toLocaleString('en-IN')}</span>
                          <span className="exp-sep">.</span>
                          <span className="exp-paise">{pVal}</span>
                        </>
                      ) : (
                        <>
                          <span className="exp-rupaye exp-zero">0</span>
                          <span className="exp-sep exp-zero">.</span>
                          <span className="exp-paise exp-zero">00</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic spacer that preserves the vertical column divider if items exceed 10 */}
            <div className="expenses-blank-spacer" aria-hidden="true">
              <div className="spacer-cell col-exp-name"></div>
              <div className="spacer-cell col-exp-amount"></div>
            </div>

            {/* Right Subtotal Row (Total Deductions) */}
            <div className="right-subtotal-bar">
              <div className="sub-cell col-exp-name font-bold label-center">एकूण</div>
              <div className="sub-cell col-exp-amount font-mono font-bold">
                <span className="exp-rupaye">{dedRupaye.toLocaleString('en-IN')}</span>
                <span className="exp-sep">.</span>
                <span className="exp-paise">{dedPaise}</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. BOTTOM SETTLEMENT SECTION (58% / 42% Unbroken Vertical Continuation)
            - Left (58%): Farmer Thumbprint/Signature & Traditional APMC Notices
            - Right (42%): वजा खर्च, एकूण रक्कम (Net Amount Box), and M.A.B TRADERS Signature
            ========================================================================= */}
        <div className="receipt-bottom-settlement-grid">
          {/* Left Block: Farmer Signature & Footer Notices (58%) */}
          <div className="settlement-col-left">
            <div className="farmer-signature-box">
              <div className="sig-touch-space"></div>
              <div className="farmer-sig-label font-bold">मालधण्याची सही किंवा अंगठा</div>
            </div>

            <div className="mandi-rules-notices">
              <div className="rule-line font-bold text-red">रविवार सुट्टी</div>
              <div className="rule-line font-medium">(चुकभूल देणे घेणे)</div>
              <div className="rule-line font-bold text-green">
                विक्री झालेल्या मालाची पट्टी रोख मिळेल.
              </div>
            </div>
          </div>

          {/* Right Block: Deductions, Net Amount & Merchant Signature (42%) */}
          <div className="settlement-col-right-wrap">
            {/* Upper Row: वजा खर्च */}
            <div className="settle-deduction-row">
              <span className="settle-label font-bold">वजा खर्च :</span>
              <span className="settle-val font-mono font-bold">
                {dedRupaye.toLocaleString('en-IN')}.{dedPaise}
              </span>
            </div>

            {/* Lower Row: Net Payable Amount Box + M.A.B TRADERS Signature */}
            <div className="settle-bottom-split">
              <div className="settle-net-box">
                <div className="net-title-badge font-bold">एकूण रक्कम</div>
                <div className="net-amount-number font-mono font-bold">
                  {netRupaye.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="settle-trader-box">
                <div className="trader-sig-touch"></div>
                <div className="trader-sig-label font-bold">
                  M.A.B TRADERS करिता
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Developer Credit - Very small text at the absolute bottom */}
        <div className="receipt-developer-credit">
          <div className="receipt-dev-line">Designed &amp; Developed by Faiz Parande</div>
          <div className="receipt-dev-line">Contact: 9699858890</div>
        </div>
      </div>

      <div className="tractor-feed-sprocket sprocket-right" aria-hidden="true">
        {[...Array(sprocketCount)].map((_, i) => (
          <span key={`r-${i}`} className="sprocket-hole"></span>
        ))}
      </div>
    </div>
  );
});

MandiReceipt.displayName = 'MandiReceipt';

export default MandiReceipt;
