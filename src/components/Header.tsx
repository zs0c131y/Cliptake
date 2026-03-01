import React from 'react';
import { FiDownloadCloud, FiGithub } from 'react-icons/fi';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <FiDownloadCloud className="logo-icon" />
          <span>Clip<span className="gradient-text">take</span></span>
        </div>

        <nav className="header-nav">
          <a href="#features">Features</a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-badge"
          >
            <FiGithub size={13} />
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
