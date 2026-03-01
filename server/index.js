const express = require('express');
const cors = require('cors');
const youtubedl = require('youtube-dl-exec');

const app = express();
app.use(cors());

// Format bytes helper
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Convert seconds helper
function formatDuration(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

app.get('/api/info', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        console.log(`Fetching info for ${url}...`);
        const output = await youtubedl(url, {
            dumpJson: true,
            noWarnings: true,
            callHome: false,
            noCheckCertificate: true,
        });

        // Map and filter formats
        const videoFormats = [];
        const audioFormats = [];

        output.formats.forEach(f => {
            // Only keeping formats that have a known size/filesize approx for cleaner UI, unless it's a very good format
            const size = f.filesize || f.filesize_approx;
            const formattedSize = size ? formatBytes(size) : 'Unknown size';

            // Audio formats (usually m4a or webm with no video)
            if (f.vcodec === 'none' && f.acodec !== 'none') {
                audioFormats.push({
                    format_id: f.format_id,
                    ext: f.ext,
                    label: `Audio (${f.abr || f.tbr} kbps) - ${f.ext}`,
                    size: formattedSize,
                    rawSize: size || 0,
                    quality: f.abr || 0
                });
            }
            // Video formats (has video. might have audio or might need merge, we'll expose the high res ones)
            else if (f.vcodec !== 'none') {
                const resolution = f.format_note || `${f.height}p`;
                const label = `${resolution} ${f.fps ? f.fps + 'fps' : ''} (${f.ext})`;
                const isVideoMuted = f.acodec === 'none'; // Needs merging
                const finalLabel = isVideoMuted ? `${label} (Needs merge)` : label;

                // Exclude very low quality ones if we want a clean UI, but we'll include them for now 
                // and deduplicate based on resolution string below
                videoFormats.push({
                    format_id: f.format_id,
                    ext: f.ext,
                    resolution: f.height || 0,
                    label: finalLabel,
                    size: formattedSize,
                    rawSize: size || 0,
                    needsMerge: isVideoMuted
                });
            }
        });

        // Deduplicate and sort video formats by resolution descending
        const uniqueVideoFormats = [];
        const seenRes = new Set();
        videoFormats
            .sort((a, b) => b.resolution - a.resolution)
            .forEach(f => {
                // If it's a common resolution like 1080, 720, 480 AND we haven't added it yet
                if (f.resolution >= 144 && !seenRes.has(f.label)) {
                    seenRes.add(f.label);
                    uniqueVideoFormats.push(f);
                }
            });

        // Sort audio by quality descending
        const sortedAudioFormats = audioFormats
            .sort((a, b) => b.quality - a.quality)
            .slice(0, 5); // Keep top 5 audio

        const result = {
            title: output.title,
            thumbnail: output.thumbnail,
            duration: formatDuration(output.duration),
            videoFormats: uniqueVideoFormats.slice(0, 10), // Keep top 10
            audioFormats: sortedAudioFormats,
        };

        return res.json(result);
    } catch (error) {
        console.error('Error fetching info:', error);
        return res.status(500).json({ error: 'Failed to fetch video info. Ensure the URL is valid.' });
    }
});

const fs = require('fs');
const path = require('path');
const os = require('os');

// SSE Connection Store
const connections = new Map();

// SSE Route for progress tracking
app.get('/api/progress/:sessionId', (req, res) => {
    const { sessionId } = req.params;

    // Set headers for Server-Sent Events
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // Store connection
    connections.set(sessionId, res);

    req.on('close', () => {
        connections.delete(sessionId);
    });
});

app.get('/api/download', async (req, res) => {
    const { url, format, sessionId = Math.random().toString(36).substring(2, 15) } = req.query;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    let formatCode = format || 'best';

    // For specific format ID (like video-only), tell yt-dlp to merge with best audio
    // We add [ext=mp4] to encourage mp4 merging if possible, and fallback to mkv/webm if necessary
    const formatReq = formatCode.includes('best') || formatCode.includes('audio')
        ? formatCode
        : `${formatCode}+bestaudio/best`;

    console.log(`Downloading: ${url} with format: ${formatReq} (Session: ${sessionId})`);

    // Create a temporary filename
    const tmpDir = os.tmpdir();
    // Let yt-dlp decide the final extension since merging might change it
    const outputTemplate = path.join(tmpDir, `ytdlp_${sessionId}_%(title)s.%(ext)s`);

    try {
        console.log(`Starting download to temp local file...`);
        // execute youtube-dl using the raw exec command to capture stdout
        const dlProcess = youtubedl.exec(url, {
            format: formatReq,
            output: outputTemplate,
            noWarnings: true,
            addHeader: ['referer:youtube.com', 'user-agent:Mozilla/5.0']
        });

        // Listen to stdout to parse downloading progress
        dlProcess.stdout.on('data', (data) => {
            const output = data.toString();
            // yt-dlp stdout example: [download]  45.0% of 1.2GiB at 5.0MiB/s ETA 00:30
            const progressMatch = output.match(/\[download\]\s+([\d\.]+)%\s+of\s+.*?\s+at\s+(.*?)\s+ETA\s+(.*)/);
            if (progressMatch && connections.has(sessionId)) {
                const percent = parseFloat(progressMatch[1]);
                const speed = progressMatch[2];
                const eta = progressMatch[3].trim();

                connections.get(sessionId).write(`data: ${JSON.stringify({
                    status: 'downloading',
                    percent,
                    speed,
                    eta
                })}\n\n`);
            } else if (output.includes('[Merger]') || output.includes('Merging')) {
                if (connections.has(sessionId)) {
                    connections.get(sessionId).write(`data: ${JSON.stringify({ status: 'processing' })}\n\n`);
                }
            }
        });

        await dlProcess; // Wait for completion

        if (connections.has(sessionId)) {
            connections.get(sessionId).write(`data: ${JSON.stringify({ status: 'completed' })}\n\n`);
            connections.get(sessionId).end();
            connections.delete(sessionId);
        }

        console.log(`Download/Merge complete. Finding actual file...`);
        // We have to find the actual file because the extension could be .mp4, .mkv, .webm
        const files = fs.readdirSync(tmpDir);
        const downloadedFile = files.find(f => f.startsWith(`ytdlp_${sessionId}_`));

        if (!downloadedFile) {
            throw new Error('Downloaded file not found after success.');
        }

        const filePath = path.join(tmpDir, downloadedFile);
        console.log(`Streaming ${filePath} to client...`);

        // Use res.download to handle headers and streaming cleanly
        res.download(filePath, downloadedFile.replace(`ytdlp_${sessionId}_`, ''), (err) => {
            if (err) {
                console.error('Error during client streaming:', err);
                if (!res.headersSent) res.status(500).send('Error streaming file');
            }
            // Cleanup the file after sending
            try {
                fs.unlinkSync(filePath);
                console.log(`Cleaned up temp file: ${filePath}`);
            } catch (cleanupErr) {
                console.error(`Failed to cleanup temp file: ${filePath}`, cleanupErr);
            }
        });

    } catch (error) {
        console.error('Download process error:', error);
        if (!res.headersSent) {
            res.status(500).send('Failed to process download.');
        }
    }
});

// Serve static frontend files in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use((req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    app.use((req, res) => {
        res.send('API is running, but frontend build not found. Run "npm run build" in the root directory.');
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
