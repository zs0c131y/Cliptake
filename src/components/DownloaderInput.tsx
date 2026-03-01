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
        <div className="downloader-container animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="downloader-form">
                <div className="input-wrapper glass-panel">

                    {/* Format Selector Dropdown (Custom) */}
                    <div className="format-selector">
                        <button
                            type="button"
                            className="format-toggle"
                            onClick={() => setIsFormatOpen(!isFormatOpen)}
                        >
                            {format === 'video' ? <FiVideo /> : <FiMusic />}
                            <span>{format === 'video' ? 'MP4' : 'MP3'}</span>
                            <FiChevronDown className={`chevron ${isFormatOpen ? 'open' : ''}`} />
                        </button>

                        {isFormatOpen && (
                            <div className="format-menu glass-panel">
                                <button
                                    type="button"
                                    className={`format-option ${format === 'video' ? 'active' : ''}`}
                                    onClick={() => { setFormat('video'); setIsFormatOpen(false); }}
                                >
                                    <FiVideo /> Video (MP4)
                                </button>
                                <button
                                    type="button"
                                    className={`format-option ${format === 'audio' ? 'active' : ''}`}
                                    onClick={() => { setFormat('audio'); setIsFormatOpen(false); }}
                                >
                                    <FiMusic /> Audio (MP3)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* URL Input */}
                    <input
                        type="url"
                        className="url-input"
                        placeholder="Paste YouTube link here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || !url.trim()}
                    >
                        {isLoading ? (
                            <span className="loader"></span>
                        ) : (
                            <>
                                <FiSearch /> <span>Fetch</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DownloaderInput;
