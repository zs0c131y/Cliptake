import React from 'react';
import { FiDownloadCloud } from 'react-icons/fi';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-brand">
                    <FiDownloadCloud className="logo-icon" />
                    <span>Clip<span className="gradient-text">take</span></span>
                    <span className="footer-copy">— © {new Date().getFullYear()}</span>
                </div>

                <nav className="footer-links">
                    <a href="#terms">Terms</a>
                    <a href="#privacy">Privacy</a>
                    <a href="#dmca">DMCA</a>
                    <a href="#faq">FAQ</a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
