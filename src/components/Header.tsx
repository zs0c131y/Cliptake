import React from 'react';
import { FiDownloadCloud } from 'react-icons/fi';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <FiDownloadCloud className="logo-icon" />
          <span className="logo-text">Vid<span className="gradient-text">Fetch</span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
