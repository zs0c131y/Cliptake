import React from 'react';
import { FiDownloadCloud, FiGithub, FiMoon, FiSun } from 'react-icons/fi';
import './Header.css';

interface HeaderProps {
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
    return (
        <header className="header">
            <div className="header-inner">
        <div className="logo">
          <FiDownloadCloud className="logo-icon" />
          <span>Clip<span className="gradient-text">take</span></span>
        </div>

        <nav className="header-nav">
          <a href="#features">Features</a>
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
          </button>
          <a
            href="https://github.com/zs0c131y/Cliptake"
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
