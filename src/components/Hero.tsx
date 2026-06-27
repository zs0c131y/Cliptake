import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
    return (
        <section className="hero animate-fade-in">
            <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                Direct links · Smart merge · Low bandwidth
            </div>

            <h1 className="hero-title">
                Fast YouTube downloads<br />
                without the server bloat
            </h1>

            <p className="hero-subtitle">
                Paste a link, choose video or audio, and Cliptake uses the cheapest reliable path:
                direct transfer when available, temporary merging only when needed.
            </p>
        </section>
    );
};

export default Hero;
