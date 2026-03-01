import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
    return (
        <section className="hero animate-fade-in">
            <div className="hero-eyebrow">
                <span className="hero-eyebrow-dot" />
                YouTube · 4K · MP3
            </div>

            <h1 className="hero-title">
                Download anything<br />
                from <span className="gradient-text">YouTube</span>
            </h1>

            <p className="hero-subtitle">
                Paste a link, pick your quality, and download in seconds.
                Up to 4K video or lossless audio — free and private.
            </p>
        </section>
    );
};

export default Hero;
