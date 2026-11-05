import React from 'react';
import { X, Building2, User, Phone } from 'lucide-react';
import { MabLogoGraphic } from '../print/ProduceGraphics';
import './AboutModal.css';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="about-modal-backdrop" onClick={onClose}>
      <div className="about-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="about-modal-header">
          <div className="about-header-branding">
            <MabLogoGraphic size={32} />
            <div>
              <h3>M.A.B TRADERS</h3>
              <p className="about-header-sub">Mandi Billing Web Application</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close-about"
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="about-modal-body">
          {/* SECTION 1: BUSINESS OVERVIEW */}
          <div className="about-card-section">
            <div className="about-section-label">
              <Building2 size={16} className="text-red" />
              <span>Business Overview</span>
            </div>
            <p className="about-section-text">
              Official Mandi / APMC Commission Agent Billing Application built for <strong>M.A.B TRADERS</strong>, operating at Shri Siddheshwar Market Yard, Solapur, Maharashtra.
            </p>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#334155', lineHeight: '1.4' }}>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>Business Contacts: </span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>Nehal: 9699485027 | Faizan: 7083038821 | Izhan: 9028342736 | Muzammil: 9922559471</span>
            </div>
          </div>

          {/* SECTION 2: DEVELOPER DETAILS */}
          <div className="about-card-section about-dev-section">
            <div className="about-section-label">
              <User size={16} className="text-blue" />
              <span>Developer Details</span>
            </div>
            <div className="about-dev-info-box">
              <div className="dev-main-title">
                Designed &amp; Developed by Faiz Parande
              </div>
              <div className="dev-contact-row">
                <Phone size={14} className="text-slate" />
                <span className="dev-contact-label">Contact:</span>
                <span className="dev-contact-val">9699858890</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="about-modal-footer">
          <button type="button" className="btn-modal-done" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
