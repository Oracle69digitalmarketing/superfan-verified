// backend/index.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

// In-memory stores (swap for DB later)
const badges = {}; // { userId: { artist: badgeLevel, issuedAt } }
const leaderboard = {}; // { artist: { userId: score } }

// Mock streaming history generator
app.get('/mock/streaming-history', (req, res) => {
  const { platform = 'spotify', user = 'user1', artist = 'ArtistX' } = req.query;
  // Fake data: listen count, recent plays
  const history = {
    user,
    platform,
    artist,
    totalPlays: Math.floor(Math.random() * 5000) + 100, // random between 100-5100
    lastPlayed: new Date().toISOString(),
    sampledTracks: [
      { track: 'Hit Song 1', plays: Math.floor(Math.random() * 1000) },
      { track: 'Hit Song 2', plays: Math.floor(Math.random() * 1000) },
    ],
  };
  res.json(history);
});

// Verification stub: issues a signed proof
app.post('/verify', (req, res) => {
  const { user, platform, artist, totalPlays } = req.body;
  if (!user || !artist || totalPlays == null) {
    return res.status(400).json({ error: 'missing fields' });
  }

  // Simple logic: determine badge eligibility
  let badgeLevel = null;
  if (totalPlays >= 3000) badgeLevel = 'superfan';
  else if (totalPlays >= 1000) badgeLevel = 'fan';
  else badgeLevel = 'starter';

  // Issue badge and update leaderboard
  badges[user] = { artist, badgeLevel, issuedAt: new Date().toISOString() };
  leaderboard[artist] = leaderboard[artist] || {};
  leaderboard[artist][user] = totalPlays;

  // Create proof token (JWT)
  const proof = jwt.sign(
    { user, platform, artist, totalPlays, badgeLevel },
    process.env.PROOF_SECRET,
    { expiresIn: '1h' }
  );

  res.json({
    proof,
    badge: { level: badgeLevel, artist, issuedAt: badges[user].issuedAt },
  });
});

// Leaderboard endpoint
app.get('/leaderboard/:artist', (req, res) => {
  const { artist } = req.params;
  const board = leaderboard[artist] || {};
  // sort descending
  const sorted = Object.entries(board)
    .map(([user, score]) => ({ user, score }))
    .sort((a, b) => b.score - a.score);
  res.json({ artist, top: sorted.slice(0, 10) });
});

// Badge status
app.get('/badge/:user', (req, res) => {
  const { user } = req.params;
  const badge = badges[user];
  if (!badge) return res.status(404).json({ error: 'no badge' });
  res.json(badge);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
