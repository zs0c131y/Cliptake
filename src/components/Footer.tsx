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
                        Fast, private video and audio downloads.
                    </p>
                </div>

                <div className="footer-links-group">
                    <div>
                        <h4>Legal</h4>
                        <a href="#terms">Terms</a>
                        <a href="#privacy">Privacy</a>
                        <a href="#dmca">DMCA</a>
                    </div>
                    <div>
                        <h4>Help</h4>
                        <a href="#faq">FAQ</a>
                        <a href="#contact">Contact</a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} VidFetch</p>
            </div>
        </footer>
    );
};

export default Footer;
