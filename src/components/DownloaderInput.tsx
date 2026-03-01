import React, { useState } from 'react';
import { FiSearch, FiVideo, FiMusic, FiChevronDown } from 'react-icons/fi';
import './DownloaderInput.css';

interface DownloaderInputProps {
    onSearch: (url: string, format: 'video' | 'audio') => void;
    isLoading: boolean;
}

const DownloaderInput: React.FC<DownloaderInputProps> = ({ onSearch, isLoading }) => {
    const [url, setUrl] = useState('');
    const [format, setFormat] = useState<'video' | 'audio'>('video');
    const [isFormatOpen, setIsFormatOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onSearch(url, format);
        }
    };

    return (
        <div className="downloader-container animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    {/* Format Selector */}
                    <div className="format-selector">
                        <button
                            type="button"
                            className="format-toggle"
                            onClick={() => setIsFormatOpen(!isFormatOpen)}
                        >
                            {format === 'video' ? <FiVideo size={13} /> : <FiMusic size={13} />}
                            <span>{format === 'video' ? 'Video' : 'Audio'}</span>
                            <FiChevronDown className={`chevron ${isFormatOpen ? 'open' : ''}`} />
                        </button>

                        {isFormatOpen && (
                            <div className="format-menu">
                                <button
                                    type="button"
                                    className={`format-option ${format === 'video' ? 'active' : ''}`}
                                    onClick={() => { setFormat('video'); setIsFormatOpen(false); }}
                                >
                                    <FiVideo size={14} /> Video (MP4)
                                </button>
                                <button
                                    type="button"
                                    className={`format-option ${format === 'audio' ? 'active' : ''}`}
                                    onClick={() => { setFormat('audio'); setIsFormatOpen(false); }}
                                >
                                    <FiMusic size={14} /> Audio (MP3)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Vertical divider */}
                    <span className="input-divider" aria-hidden="true" />

                    {/* URL input */}
                    <input
                        type="url"
                        className="url-input"
                        placeholder="Paste YouTube link..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || !url.trim()}
                    >
                        {isLoading ? (
                            <span className="loader" />
                        ) : (
                            <>
                                <FiSearch size={14} /><span>Fetch</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            <p className="input-hint">
                Supports youtube.com &amp; youtu.be links
            </p>
        </div>
    );
};

export default DownloaderInput;
