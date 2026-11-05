import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Receipt, 
  History, 
  FileSpreadsheet, 
  Settings,
  Info 
} from 'lucide-react';

export default function Sidebar({ onOpenAbout }) {
  const links = [
    { to: '/', label: 'New Bill', icon: Receipt },
    { to: '/history', label: 'Bill History', icon: History },
    { to: '/backup', label: 'Excel Backup', icon: FileSpreadsheet },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="mab-sidebar">
      <div className="sidebar-menu">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}

        {onOpenAbout && (
          <button
            type="button"
            className="sidebar-link sidebar-about-btn"
            onClick={onOpenAbout}
          >
            <Info size={18} />
            <span>About</span>
          </button>
        )}
      </div>

      <div className="sidebar-dev-footer">
        <div className="sidebar-dev-line1">Designed &amp; Developed by Faiz Parande</div>
        <div className="sidebar-dev-line2">Contact: 9699858890</div>
      </div>
    </aside>
  );
}
