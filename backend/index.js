require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

// In-memory stores
const badges = {}; // { userId: { artist, badgeLevel, issuedAt, proof } }
const leaderboard = {}; // { artist: { userId: totalPlays } }

// Mock streaming history generator
app.get('/mock/streaming-history', (req, res) => {
  const { platform = 'spotify', user = 'user1', artist = 'ArtistX' } = req.query;
  const history = {
    user,
    platform,
    artist,
    totalPlays: Math.floor(Math.random() * 5000) + 100,
    lastPlayed: new Date().toISOString(),
    sampledTracks: [
      { track: 'Hit Song 1', plays: Math.floor(Math.random() * 1000) },
      { track: 'Hit Song 2', plays: Math.floor(Math.random() * 1000) }
    ]
  };
  res.json(history);
});

// Verification with zkTLS stub
app.post('/verify', async (req, res) => {
  const { user, platform, artist, totalPlays, window = 'last_30_days' } = req.body;
  if (!user || !artist || totalPlays == null) {
    return res.status(400).json({ error: 'missing fields' });
  }

  // Build summary payload for proof
  const proofRequestPayload = {
    userId: user,
    platform,
    artist,
    totalPlays,
    window,
    timestamp: new Date().toISOString()
  };

  // Request zkTLS proof (stub/mock for now)
  let proofResult;
  try {
    proofResult = await requestZkProof(proofRequestPayload);
  } catch (err) {
    console.error('zkTLS proof error:', err);
    return res.status(500).json({ error: 'verification failed' });
  }

  if (!proofResult.success) {
    return res.status(400).json({ error: 'proof invalid' });
  }

  // Determine badge level
  let badgeLevel = 'starter';
  if (totalPlays >= 3000) badgeLevel = 'superfan';
  else if (totalPlays >= 1000) badgeLevel = 'fan';

  // Persist badge and update leaderboard
  badges[user] = {
    artist,
    badgeLevel,
    issuedAt: new Date().toISOString(),
    proof: proofResult.proof
  };
  leaderboard[artist] = leaderboard[artist] || {};
  leaderboard[artist][user] = totalPlays;

  // Return response
  res.json({
    proof: proofResult.proof,
    badge: { level: badgeLevel, artist, issuedAt: badges[user].issuedAt }
  });
});

// Leaderboard endpoint
app.get('/leaderboard/:artist', (req, res) => {
  const { artist } = req.params;
  const board = leaderboard[artist] || {};
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

// Placeholder zkTLS proof requester
async function requestZkProof(summary) {
  // === replace this block with real XION/Dave SDK integration ===
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        proof: {
          type: 'mock-zktls',
          issued: new Date().toISOString(),
          summaryHash: Buffer.from(JSON.stringify(summary)).toString('base64'),
          signature: 'MOCK_SIGNATURE_PLACEHOLDER'
        }
      });
    }, 200);
  });
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Backend running on http://localhost:' + PORT);
});
