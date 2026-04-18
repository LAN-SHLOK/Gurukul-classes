// server.js — Custom Node.js server: Next.js + Socket.io + MongoDB Change Streams
require('dotenv').config({ path: '.env.local' });

const { createServer } = require('http');
const { Server } = require('socket.io');
const next = require('next');
const mongoose = require('mongoose');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev });
const handle = app.getRequestHandler();

async function startChangeStreamWatchers(io) {
  const collections = [
    { name: 'events',    event: 'events:updated'    },
    { name: 'faculty',   event: 'faculty:updated'   },
    { name: 'toppers',   event: 'toppers:updated'   },
    { name: 'schedules', event: 'schedules:updated' },
  ];

  for (const { name, event } of collections) {
    try {
      const collection = mongoose.connection.collection(name);
      const changeStream = collection.watch([], { fullDocument: 'updateLookup' });

      changeStream.on('change', () => {
        console.log(`[ChangeStream] ${name} changed — emitting ${event}`);
        io.emit(event);
      });

      changeStream.on('error', (err) => {
        console.error(`[ChangeStream] Error on ${name}:`, err.message);
        // MongoDB driver auto-resumes on transient errors
      });

      console.log(`[ChangeStream] Watching collection: ${name}`);
    } catch (err) {
      console.error(`[ChangeStream] Failed to watch ${name}:`, err.message);
    }
  }
}

app.prepare().then(async () => {
  // Connect to MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
    console.log('[MongoDB] Connected');
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    console.warn('[MongoDB] Starting server without DB — some features will not work');
  }

  const httpServer = createServer((req, res) => handle(req, res));

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  let onlineCount = 0;

  io.on('connection', (socket) => {
    onlineCount++;
    io.emit('presence', onlineCount);
    console.log(`[Socket.io] Client connected: ${socket.id} | Online: ${onlineCount}`);

    socket.on('presence:join', () => {
      socket.emit('presence', onlineCount);
    });

    socket.on('disconnect', () => {
      onlineCount = Math.max(0, onlineCount - 1);
      io.emit('presence', onlineCount);
      console.log(`[Socket.io] Client disconnected: ${socket.id} | Online: ${onlineCount}`);
    });
  });

  // Start MongoDB Change Stream watchers only if connected
  if (mongoose.connection.readyState === 1) {
    await startChangeStreamWatchers(io);
  }

  httpServer.listen(port, () => {
    console.log(`[Server] Ready on http://localhost:${port} (${dev ? 'dev' : 'prod'})`);

    // ── Self-ping to prevent Render free tier sleep ──────────────────────────
    const appUrl = process.env.NEXTAUTH_URL || process.env.RENDER_EXTERNAL_URL;
    if (appUrl && process.env.NODE_ENV === 'production') {
      setInterval(async () => {
        try {
          await fetch(`${appUrl}/api/health`);
          console.log('[Keep-alive] Pinged', appUrl);
        } catch (e) {
          console.warn('[Keep-alive] Ping failed:', e.message);
        }
      }, 14 * 60 * 1000); // every 14 minutes
    }
  });

  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[Server] ❌ Port ${port} is already in use!`);
      console.error(`[Server] Kill it with: for /f "tokens=5" %a in ('netstat -ano ^| findstr ":${port} "') do taskkill /PID %a /F`);
      process.exit(1);
    }
    throw err;
  });
});
