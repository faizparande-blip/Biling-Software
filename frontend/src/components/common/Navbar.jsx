import React from 'react';
import { NavLink } from 'react-router-dom';
import { MabLogoGraphic } from '../print/ProduceGraphics';
import PwaInstallButton from './PwaInstallButton';
import { Receipt, History, FileSpreadsheet, Settings, Info } from 'lucide-react';

export default function Navbar({ onOpenAbout }) {
  const navItems = [
    { to: '/', label: 'New Bill', icon: Receipt },
    { to: '/history', label: 'Bill History', icon: History },
    { to: '/backup', label: 'Excel Backup', icon: FileSpreadsheet },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="mab-navbar">
      <div className="navbar-brand">
        <MabLogoGraphic size={36} />
        <div className="brand-text">
          <div className="brand-title-row">
            <h2>M.A.B TRADERS</h2>
            <span className="brand-badge">Solapur APMC</span>
          </div>
          <span className="brand-sub">
            Onion, Potato, Garlic & Agricultural Commission Agent
          </span>
          <div className="navbar-contacts-banner">
            <span className="nav-contact-item">
              <span className="nav-contact-name">Nehal:&nbsp;</span>9699485027
            </span>
            <span className="nav-contact-sep">|</span>
            <span className="nav-contact-item">
              <span className="nav-contact-name">Faizan:&nbsp;</span>7083038821
            </span>
            <span className="nav-contact-sep">|</span>
            <span className="nav-contact-item">
              <span className="nav-contact-name">Izhan:&nbsp;</span>9028342736
            </span>
            <span className="nav-contact-sep">|</span>
            <span className="nav-contact-item">
              <span className="nav-contact-name">Muzammil:&nbsp;</span>9922559471
            </span>
          </div>
        </div>
      </div>

      {/* Primary Top Nav Links */}
      <div className="navbar-nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-tab-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="navbar-actions-right">
        {onOpenAbout && (
          <button
            type="button"
            className="btn-nav-about"
            onClick={onOpenAbout}
            title="About Application & Developer"
          >
            <Info size={15} />
            <span>About</span>
          </button>
        )}
        <PwaInstallButton />
      </div>
    </nav>
  );
}
