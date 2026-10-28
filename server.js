'use strict';

require('dotenv').config();

const express = require('express');
const path = require('path');
const { startPairing, loadSavedSessions, getConnectedSessions, deleteSession } = require('./lib/whatsapp');

const app = express();
const PORT = process.env.PORT || 3000;

// Simple in-memory rate limit for pairing requests
const pairAttempts = new Map();
const PAIR_COOLDOWN_MS = 15000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check (useful for free hosts that ping /health)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', bot: 'Icon AI', time: new Date().toISOString() });
});

// API: request a pairing code
app.post('/api/pair', async (req, res) => {
  try {
    const phone = String(req.body?.phone || '').replace(/\D/g, '');

    if (!/^\d{7,15}$/.test(phone)) {
      return res.status(400).json({
        ok: false,
        error: 'Enter a valid number with country code (e.g. 2348012345678)'
      });
    }

    // Rate limit per IP + number
    const key = `${req.ip}:${phone}`;
    const last = pairAttempts.get(key) || 0;
    if (Date.now() - last < PAIR_COOLDOWN_MS) {
      return res.status(429).json({
        ok: false,
        error: 'Please wait a few seconds before requesting another code.'
      });
    }
    pairAttempts.set(key, Date.now());

    const result = await startPairing(phone);

    res.json({
      ok: true,
      phone: result.phone,
      code: result.code,
      message: 'Enter this code on your phone'
    });
  } catch (err) {
    console.error('Pair API error:', err.message);
    res.status(500).json({
      ok: false,
      error: err.message || 'Failed to generate pairing code'
    });
  }
});

// API: list connected sessions (optional, for dashboard)
app.get('/api/sessions', (req, res) => {
  res.json({ ok: true, sessions: getConnectedSessions() });
});

// API: remove a session
app.post('/api/logout', (req, res) => {
  const phone = String(req.body?.phone || '').replace(/\D/g, '');
  if (!/^\d{7,15}$/.test(phone)) {
    return res.status(400).json({ ok: false, error: 'Invalid phone' });
  }
  deleteSession(phone);
  res.json({ ok: true, message: `Session for +${phone} removed` });
});

// Serve the website for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start
async function main() {
  console.log('Loading saved WhatsApp sessions…');
  await loadSavedSessions();

  app.listen(PORT, () => {
    console.log(`\n✦ Icon AI is running`);
    console.log(`  Local:   http://localhost:${PORT}`);
    console.log(`  Health:  http://localhost:${PORT}/health\n`);
  });
}

main().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
