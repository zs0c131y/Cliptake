import React from 'react';
import { FiHardDrive, FiShield, FiSmartphone, FiZap } from 'react-icons/fi';
import './Features.css';

const featuresData = [
    {
        icon: <FiZap size={16} />,
        title: 'Direct when possible',
        description: 'Single-file formats can hand off to the source, cutting server bandwidth.'
    },
    {
        icon: <FiHardDrive size={16} />,
        title: 'Low storage load',
        description: 'Only merged video uses temporary files, and they are removed after delivery.'
    },
    {
        icon: <FiShield size={16} />,
        title: 'Durable flow',
        description: 'High-resolution streams keep the reliable merge path when audio is separate.'
    },
    {
        icon: <FiSmartphone size={16} />,
        title: 'Any screen',
        description: 'Responsive controls, readable type, and complete light and dark themes.'
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
