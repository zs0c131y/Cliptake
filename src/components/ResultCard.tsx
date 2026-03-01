import React, { useState } from 'react';
import { FiDownload, FiClock, FiFileText } from 'react-icons/fi';
import './ResultCard.css';

interface ResultCardProps {
    title: string;
    thumbnail: string;
    duration: string;
    format: 'video' | 'audio';
    qualities: any[];
    onDownload: (formatId: string) => void;
    originalUrl?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
    title, thumbnail, duration, format, qualities, onDownload, originalUrl
}) => {
    const [downloadingFormatId, setDownloadingFormatId] = useState<string | null>(null);
    const [progress, setProgress] = useState<{ percent: number, speed: string, eta: string }>({
        percent: 0, speed: '', eta: ''
    });

    const handleStartDownload = (formatId: string) => {
        if (!originalUrl) {
            onDownload(formatId);
            return;
        }

        setDownloadingFormatId(formatId);
        setProgress({ percent: 0, speed: 'Starting…', eta: 'Calculating' });

        const sessionId = Math.random().toString(36).substring(2, 15);
        const finalDownloadUrl = `/api/download?url=${encodeURIComponent(originalUrl)}&format=${formatId}&sessionId=${sessionId}`;

        setTimeout(() => {
            window.location.href = finalDownloadUrl;
        }, 500);

        const eventSource = new EventSource(`/api/progress/${sessionId}`);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.status === 'downloading') {
                    setProgress({ percent: data.percent, speed: data.speed, eta: data.eta });
                } else if (data.status === 'processing') {
                    setProgress({ percent: 100, speed: 'Merging…', eta: 'Finalizing' });
                } else if (data.status === 'completed') {
                    eventSource.close();
                    setTimeout(() => setDownloadingFormatId(null), 3000);
                }
            } catch (err) {
                console.error('Error parsing progress SSE:', err);
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
            setDownloadingFormatId(null);
        };
    };

    return (
        <div className="result-card animate-fade-in">
            {/* Thumbnail + title */}
            <div className="result-header">
                <div className="thumbnail-wrapper">
                    <img src={thumbnail} alt={title} className="thumbnail" />
                    <span className="duration-badge">
                        <FiClock size={10} /> {duration}
                    </span>
                </div>
                <div className="result-meta">
                    <p className="result-title">{title}</p>
                </div>
            </div>

            {/* Quality rows */}
            <div className="quality-section">
                <p className="section-label">
                    Available {format === 'video' ? 'Video' : 'Audio'} Qualities
                </p>
                <div className="quality-list">
                    {qualities.map((q, idx) => (
                        <div key={idx} className="quality-item">
                            <div className="quality-info">
                                <FiFileText className="format-icon" />
                                <span className="quality-label">{q.label}</span>
                                <span className="quality-size">{q.size}</span>
                            </div>
                            <div className="quality-action">
                                {downloadingFormatId === q.format_id ? (
                                    <div className="progress-status-container animate-fade-in">
                                        <span className="progress-text">
                                            {progress.percent === 100 ? progress.speed : `${progress.percent}%`}
                                        </span>
                                        <span className="progress-detail">
                                            {progress.percent < 100
                                                ? `${progress.speed} – ETA: ${progress.eta}`
                                                : progress.eta}
                                        </span>
                                        <div className="progress-bar-inline">
                                            <div
                                                className="progress-bar-inline-fill"
                                                style={{ width: `${Math.max(5, progress.percent)}%` }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="download-btn-small"
                                        onClick={() => handleStartDownload(q.format_id)}
                                        aria-label={`Download ${q.label}`}
                                        disabled={downloadingFormatId !== null}
                                        style={downloadingFormatId ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                                    >
                                        <FiDownload size={12} /> Download
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
