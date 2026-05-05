// WildSnap leaderboard server.
// In-memory only — entries reset whenever the process restarts.

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/** @type {Map<string, { playerName: string, score: number, rare: number, updatedAt: number }>} */
const leaderboard = new Map();

function snapshot() {
  return Array.from(leaderboard.values()).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.rare !== a.rare) return b.rare - a.rare;
    return a.updatedAt - b.updatedAt;
  });
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/leaderboard', (_req, res) => {
  res.json({ entries: snapshot() });
});

app.post('/api/leaderboard', (req, res) => {
  const { playerName, score, rare } = req.body || {};
  if (typeof playerName !== 'string' || !playerName.trim()) {
    return res.status(400).json({ error: 'playerName is required' });
  }
  const name = playerName.trim().slice(0, 32);
  const safeScore = Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0;
  const safeRare = Number.isFinite(rare) ? Math.max(0, Math.floor(rare)) : 0;

  const existing = leaderboard.get(name);
  if (!existing || safeScore > existing.score) {
    leaderboard.set(name, {
      playerName: name,
      score: safeScore,
      rare: safeRare,
      updatedAt: Date.now(),
    });
  }
  res.json({ entries: snapshot() });
});

app.delete('/api/leaderboard', (_req, res) => {
  leaderboard.clear();
  res.json({ entries: [] });
});

app.listen(PORT, () => {
  console.log(`[wildsnap] leaderboard server listening on http://localhost:${PORT}`);
});
