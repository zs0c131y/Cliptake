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
    originalUrl?: string; // Add original url prop to execute SSE on own
}

const ResultCard: React.FC<ResultCardProps> = ({
    title, thumbnail, duration, format, qualities, onDownload, originalUrl
}) => {
    const [downloadingFormatId, setDownloadingFormatId] = useState<string | null>(null);
    const [progress, setProgress] = useState<{ percent: number, speed: string, eta: string }>({ percent: 0, speed: '', eta: '' });

    // Internal handler to capture download click, trigger UI state, and begin SSE
    const handleStartDownload = (formatId: string) => {
        if (!originalUrl) {
            onDownload(formatId); // Fallback to classic if url wasn't passed by App
            return;
        }

        setDownloadingFormatId(formatId);
        setProgress({ percent: 0, speed: 'Starting...', eta: 'Calculating' });

        // Generate a unique session ID so backend knows which yt-dlp stream to tie to
        const sessionId = Math.random().toString(36).substring(2, 15);

        // 1. Kick off the actual download request which the browser will catch as an attachment when ready
        const finalDownloadUrl = `/api/download?url=${encodeURIComponent(originalUrl)}&format=${formatId}&sessionId=${sessionId}`;

        // Use a tiny delay so the backend can register the SSE listener right before the download execution blocks
        setTimeout(() => {
            window.location.href = finalDownloadUrl;
        }, 500);

        // 2. Open an SSE connection to listen to real-time yt-dlp stdout parsing
        const eventSource = new EventSource(`/api/progress/${sessionId}`);

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.status === 'downloading') {
                    setProgress({
                        percent: data.percent,
                        speed: data.speed,
                        eta: data.eta
                    });
                } else if (data.status === 'processing') {
                    setProgress({ percent: 100, speed: 'Merging Video/Audio...', eta: 'Finalizing' });
                } else if (data.status === 'completed') {
                    eventSource.close();
                    setTimeout(() => setDownloadingFormatId(null), 3000); // Clear state after a few seconds
                }
            } catch (err) {
                console.error("Error parsing progress SSE:", err);
            }
        };

        eventSource.onerror = () => {
            console.error("SSE connection lost or download errored");
            eventSource.close();
            setDownloadingFormatId(null);
        };
    };

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
                                            style={downloadingFormatId ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                        >
                                            <FiDownload /> Download
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
