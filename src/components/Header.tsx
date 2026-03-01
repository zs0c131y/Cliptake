import React from 'react';
import { FiDownloadCloud, FiSun } from 'react-icons/fi';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header glass-panel">
      <div className="header-container">
        <div className="logo">
          <FiDownloadCloud className="logo-icon" />
          <span className="logo-text">Vid<span className="gradient-text">Fetch</span></span>
        </div>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="header-actions">
          <button className="theme-toggle" aria-label="Toggle theme">
            <FiSun className="theme-icon" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
