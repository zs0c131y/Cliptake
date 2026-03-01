import React from 'react';
import { FiShield, FiZap, FiSmartphone, FiVideo } from 'react-icons/fi';
import './Features.css';

const featuresData = [
    {
        icon: <FiZap />,
        title: 'Lightning Fast',
        description: 'Our dedicated servers process and deliver your files instantly, with zero artificial throttling.'
    },
    {
        icon: <FiShield />,
        title: '100% Secure',
        description: 'We respect your privacy. No logs are kept, and all connections are secured with AES encryption.'
    },
    {
        icon: <FiVideo />,
        title: 'Highest Quality',
        description: 'Download up to 4K resolution videos and 320kbps MP3 audio without any compression artifacts.'
    },
    {
        icon: <FiSmartphone />,
        title: 'Cross-Platform',
        description: 'Works flawlessly on Windows, Mac, iOS, Android, and Linux without installing any software.'
    }
];

const Features: React.FC = () => {
    return (
        <section id="features" className="features-section">
            <div className="features-header">
                <h2 className="features-title">Why choose <span className="gradient-text">VidFetch?</span></h2>
                <p className="features-subtitle">The most advanced features built into a completely free tool.</p>
            </div>

            <div className="features-grid">
                {featuresData.map((feature, idx) => (
                    <div key={idx} className="feature-card glass-panel">
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
