// Optional leaderboard API. Falls back silently when the server is unreachable
// so the game still works fully offline.

const BASE = '/api';

async function request(path, init) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init && init.headers) },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function fetchLeaderboard() {
  try {
    const data = await request('/leaderboard');
    return { ok: true, entries: data.entries || [] };
  } catch (err) {
    return { ok: false, entries: [], error: err.message };
  }
}

export async function submitScore({ playerName, score, rare }) {
  try {
    const data = await request('/leaderboard', {
      method: 'POST',
      body: JSON.stringify({ playerName, score, rare }),
    });
    return { ok: true, entries: data.entries || [] };
  } catch (err) {
    return { ok: false, entries: [], error: err.message };
  }
}
