import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import DownloaderInput from './components/DownloaderInput';
import ResultCard from './components/ResultCard';
import Features from './components/Features';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (url: string, format: 'video' | 'audio') => {
    setIsLoading(true);
    setResult(null);
    console.log('Fetching data for URL:', url);

    try {
      const response = await fetch(`/api/info?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch video info');
      }
      const data = await response.json();

      // We pass the actual format from the URL plus the data back to result
      setResult({
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        format, // what user picked initially
        qualities: format === 'video' ? data.videoFormats : data.audioFormats,
        originalUrl: url
      });
    } catch (error) {
      console.error('Search error:', error);
      alert('Error fetching info. Please check the URL or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">

      <Header />

      <main>
        <Hero />
        <DownloaderInput
          onSearch={handleSearch}
          isLoading={isLoading}
        />

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

        <Features />
      </main>

      <Footer />
    </div>
  );
};

export default App;
