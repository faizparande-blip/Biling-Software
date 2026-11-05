import React from 'react';
import './AppFooter.css';

export default function AppFooter({ onOpenAbout }) {
  return (
    <footer className="mab-app-footer">
      <div className="app-footer-container">
        <div className="app-footer-left">
          <span className="footer-firm-title">M.A.B TRADERS</span>
          <span className="footer-firm-desc">• Shri Siddheshwar Market Yard, Solapur</span>
        </div>

        <div className="app-footer-dev">
          <span className="dev-branding-line">Designed &amp; Developed by Faiz Parande</span>
          <span className="dev-branding-sep">•</span>
          <span className="dev-branding-line">Contact: 9699858890</span>
        </div>

        <div className="app-footer-right">
          {onOpenAbout && (
            <button
              type="button"
              className="btn-footer-about"
              onClick={onOpenAbout}
              title="View About & Developer Information"
            >
              About
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
