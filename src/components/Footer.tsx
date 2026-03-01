import React from 'react';
import { FiDownloadCloud } from 'react-icons/fi';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="logo">
                        <FiDownloadCloud className="logo-icon" />
                        <span className="logo-text">Vid<span className="gradient-text">Fetch</span></span>
                    </div>
                    <p className="footer-desc">
                        The simplest, fastest way to save content from the web.
                    </p>
                </div>

                <div className="footer-links-group">
                    <div>
                        <h4>Legal</h4>
                        <a href="#terms">Terms of Service</a>
                        <a href="#privacy">Privacy Policy</a>
                        <a href="#dmca">DMCA</a>
                    </div>
                    <div>
                        <h4>Support</h4>
                        <a href="#faq">FAQ</a>
                        <a href="#contact">Contact Us</a>
                        <a href="#api">API Docs</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} VidFetch. All rights reserved.</p>
                <p className="disclaimer">
                    VidFetch does not host any files on its servers. We simply provide a tool to download publicly available content.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
