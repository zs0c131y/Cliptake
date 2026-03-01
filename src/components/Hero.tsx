import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
    return (
        <section className="hero">
            <div className="hero-content animate-fade-in">
                <h1 className="hero-title">
                    Save video & audio<br />
                    <span className="gradient-text">from YouTube</span>
                </h1>
                <p className="hero-subtitle">
                    Paste a link, pick your quality, and download. High-resolution video up to 4K and lossless audio — fast, private, and free.
                </p>
            </div>
        </section>
    );
};

export default Hero;
