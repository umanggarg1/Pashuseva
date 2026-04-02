// server.js — Application entry point

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const config                                    = require('./config');
const routes                                    = require('./routes');
const { requestLogger, notFound, errorHandler } = require('./middleware');

const app = express();

// ── CORS — accepts array of origins or single wildcard ───────────────────────
const allowedOrigins = config.CORS_ORIGIN === '*'
  ? '*'
  : config.CORS_ORIGIN.split(',').map(o => o.trim());

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Admin-Token'],
  credentials: true,
}));
app.options('*', cors());   // pre-flight for all routes

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Request logger ────────────────────────────────────────────────────────────
app.use(requestLogger);

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api', routes);

// ── 404 & global error handlers ───────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
// Render requires listening on 0.0.0.0 — config.HOST is set via env var
const PORT = config.PORT;
const HOST = config.HOST;

const server = app.listen(PORT, HOST, () => {
  const addr = server.address();
  const isProduction = process.env.NODE_ENV === 'production';
  console.log('\x1b[32m');
  console.log(`  🐄  PashuSeva API — ${isProduction ? 'Production' : 'Development'}`);
  console.log(`  🚀  Listening on  ${HOST}:${addr.port}`);
  if (!isProduction) {
    console.log(`  📦  Products  →  http://localhost:${addr.port}/api/products`);
    console.log(`  🛒  Orders    →  http://localhost:${addr.port}/api/orders`);
    console.log(`  📞  Contact   →  http://localhost:${addr.port}/api/contact`);
    console.log(`  🔑  Admin     →  POST /api/auth/admin/login`);
    console.log(`  ❤️   Health    →  http://localhost:${addr.port}/api/health`);
  }
  console.log('\x1b[0m');
});

server.on('error', (err) => {
  console.error('\x1b[31m  ✖  Server error:\x1b[0m', err.message);
  process.exit(1);
});
