import React from 'react';
import { FiDownload, FiClock, FiFileText } from 'react-icons/fi';
import './ResultCard.css';

interface ResultCardProps {
    title: string;
    thumbnail: string;
    duration: string;
    format: 'video' | 'audio';
    qualities: any[];
    onDownload: (formatId: string) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({
    title, thumbnail, duration, format, qualities, onDownload
}) => {
    return (
        <div className="result-card glass-panel animate-fade-in">
            <div className="result-layout">
                <div className="thumbnail-wrapper">
                    <img src={thumbnail} alt={title} className="thumbnail" />
                    <span className="duration-badge">
                        <FiClock /> {duration}
                    </span>
                </div>

                <div className="result-details">
                    <h3 className="result-title">{title}</h3>

                    <div className="quality-list">
                        <p className="section-label">Available {format === 'video' ? 'Video' : 'Audio'} Qualities:</p>
                        {qualities.map((q, idx) => (
                            <div key={idx} className="quality-item glass-panel">
                                <div className="quality-info">
                                    <FiFileText className="format-icon" />
                                    <span className="quality-label">{q.label}</span>
                                    <span className="quality-size">{q.size}</span>
                                </div>
                                <button
                                    className="download-btn-small"
                                    onClick={() => onDownload(q.format_id)}
                                    aria-label={`Download ${q.label}`}
                                >
                                    <FiDownload /> Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
