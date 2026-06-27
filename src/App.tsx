import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DownloaderInput from './components/DownloaderInput';
import ResultCard from './components/ResultCard';
import Features from './components/Features';
import Footer from './components/Footer';
import './App.css';

type Theme = 'dark' | 'light';
type SearchFormat = 'video' | 'audio';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('cliptake-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('cliptake-theme', theme);
  }, [theme]);

  const handleSearch = async (url: string, format: SearchFormat) => {
    setIsLoading(true);
    setResult(null);
    setError('');

    try {
      const response = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || 'Failed to fetch video info');
      }
      const data = await response.json();
      const qualities = format === 'video' ? data.videoFormats : data.audioFormats;

      if (!qualities?.length) {
        throw new Error(`No ${format} formats were found for this link.`);
      }

      setResult({
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        format,
        qualities,
        originalUrl: url
      });
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="hero-backdrop" aria-hidden="true" />

      <Header
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <main>
        <section className="download-stage">
          <Hero />
          <DownloaderInput
            onSearch={handleSearch}
            isLoading={isLoading}
          />

          {error && (
            <div className="error-banner" role="alert">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="result-skeleton" aria-label="Loading video information">
              <div className="skeleton-thumb" />
              <div className="skeleton-copy">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}

          {result && !isLoading && (
            <ResultCard
              title={result.title}
              thumbnail={result.thumbnail}
              duration={result.duration}
              format={result.format}
              qualities={result.qualities}
              originalUrl={result.originalUrl}
              onDownload={(formatId) => {
                const downloadUrl = `/api/download?url=${encodeURIComponent(result.originalUrl)}&format=${formatId}`;
                window.location.href = downloadUrl;
              }}
            />
          )}
        </section>

        <Features />
      </main>

      <Footer />
    </div>
  );
};

export default App;
