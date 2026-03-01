import React from 'react';
import { FiShield, FiZap, FiSmartphone, FiVideo } from 'react-icons/fi';
import './Features.css';

const featuresData = [
    {
        icon: <FiZap size={16} />,
        title: 'Lightning Fast',
        description: 'Dedicated servers deliver files instantly with zero throttling.'
    },
    {
        icon: <FiShield size={16} />,
        title: 'Private',
        description: 'No logs kept. All connections are end-to-end secured.'
    },
    {
        icon: <FiVideo size={16} />,
        title: 'Up to 4K',
        description: 'Lossless video up to 4K and MP3 audio up to 320kbps.'
    },
    {
        icon: <FiSmartphone size={16} />,
        title: 'Any Device',
        description: 'Works on Windows, Mac, iOS and Android — no installs needed.'
    }
];

const Features: React.FC = () => {
    return (
        <section id="features" className="features-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <p className="features-label">Why Cliptake</p>
            <div className="features-grid">
                {featuresData.map((feature, idx) => (
                    <div key={idx} className="feature-card">
                        <div className="feature-icon-wrapper">
                            {feature.icon}
                        </div>
                        <h3 className="feature-name">{feature.title}</h3>
                        <p className="feature-desc">{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Features;
