const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 8000;

// MIME types with compression support
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// Cache control headers for static assets
const CACHE_CONTROL = {
  '.html': 'no-cache',
  '.css': 'public, max-age=31536000',
  '.js': 'public, max-age=31536000',
  '.png': 'public, max-age=31536000',
  '.jpg': 'public, max-age=31536000',
  '.gif': 'public, max-age=31536000',
  '.ico': 'public, max-age=31536000'
};

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.url}`);
  
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Check if client accepts gzip compression
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const shouldCompress = acceptEncoding.includes('gzip') && 
    (contentType.startsWith('text/') || contentType.includes('javascript') || contentType.includes('json'));
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        fs.readFile('./404.html', (err, content404) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content404 || '404 Not Found', 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Set headers
      const headers = {
        'Content-Type': contentType,
        'Cache-Control': CACHE_CONTROL[extname] || 'no-cache'
      };
      
      // Compress response if applicable
      if (shouldCompress) {
        headers['Content-Encoding'] = 'gzip';
        zlib.gzip(content, (err, compressed) => {
          if (err) {
            res.writeHead(500);
            res.end('Compression error');
            return;
          }
          res.writeHead(200, headers);
          res.end(compressed);
        });
      } else {
        res.writeHead(200, headers);
        res.end(content, 'utf-8');
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Production server running at http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});