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

                <p className="footer-note">Use responsibly and respect platform terms.</p>
            </div>
        </footer>
    );
};

export default Footer;
