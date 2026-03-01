import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero-content animate-fade-in">
                <h1 className="hero-title">
                    Download video & audio <br />
                    <span className="gradient-text">Lightning fast. Securely.</span>
                </h1>
                <p className="hero-subtitle">
                    The most powerful, free, and completely anonymous YouTube downloader.
                    Save content in high quality (4K, 1080p, MP3) instantly.
                </p>

                <div className="hero-badges">
                    <span className="badge">
                        <span className="dot pulse-success"></span> 100% Free
                    </span>
                    <span className="badge">
                        <span className="dot pulse-success"></span> No Ads
                    </span>
                    <span className="badge">
                        <span className="dot pulse-success"></span> Secure AES
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
