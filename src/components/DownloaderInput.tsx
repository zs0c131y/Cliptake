import React, { useState } from 'react';
import { FiLink, FiMusic, FiSearch, FiVideo } from 'react-icons/fi';
import './DownloaderInput.css';

interface DownloaderInputProps {
    onSearch: (url: string, format: 'video' | 'audio') => void;
    isLoading: boolean;
}

const DownloaderInput: React.FC<DownloaderInputProps> = ({ onSearch, isLoading }) => {
    const [url, setUrl] = useState('');
    const [format, setFormat] = useState<'video' | 'audio'>('video');
    const [touched, setTouched] = useState(false);

    const trimmedUrl = url.trim();
    const isValidUrl = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(trimmedUrl);
    const showError = touched && trimmedUrl.length > 0 && !isValidUrl;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched(true);
        if (isValidUrl) {
            onSearch(trimmedUrl, format);
        }
    };

    return (
        <div className="downloader-container animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <form onSubmit={handleSubmit}>
                <div className="mode-tabs" aria-label="Download type">
                    <button
                        type="button"
                        className={`mode-tab ${format === 'video' ? 'active' : ''}`}
                        onClick={() => setFormat('video')}
                        aria-pressed={format === 'video'}
                    >
                        <FiVideo size={15} />
                        Video
                    </button>
                    <button
                        type="button"
                        className={`mode-tab ${format === 'audio' ? 'active' : ''}`}
                        onClick={() => setFormat('audio')}
                        aria-pressed={format === 'audio'}
                    >
                        <FiMusic size={15} />
                        Audio
                    </button>
                </div>

                <div className="input-wrapper">
                    <FiLink className="input-icon" aria-hidden="true" />

                    {/* URL input */}
                    <input
                        type="url"
                        className="url-input"
                        placeholder="Paste YouTube link..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onBlur={() => setTouched(true)}
                        aria-invalid={showError}
                        aria-describedby={showError ? 'url-error' : 'url-hint'}
                        required
                        disabled={isLoading}
                    />

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`submit-btn ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading || !isValidUrl}
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

            {showError ? (
                <p className="input-hint error" id="url-error">
                    Enter a valid youtube.com or youtu.be link.
                </p>
            ) : (
                <p className="input-hint" id="url-hint">
                    Direct formats start instantly. High-resolution video may need a short merge step.
                </p>
            )}
        </div>
    );
};

export default DownloaderInput;
