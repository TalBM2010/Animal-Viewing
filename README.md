# WildSnap

A kid-friendly educational web game. Use your device camera to "capture" rare and unusual animals — the game identifies them, displays them on a projector-style screen, speaks their name aloud, and teaches you a fun fact.

> Built with React + Vite + TailwindCSS on the front end and a tiny Express server for an optional in-memory leaderboard.

## Features

- 📷 **Live camera capture** with a centered reticle (WebRTC `getUserMedia`)
- 🐾 **Animal reveal** with image, name, category, rarity, and a fun fact
- 🔊 **Voice narration** via the Web Speech API ("This is a Quokka")
- 🎯 **Scoring** with rarity bonuses and first-discovery bonuses
- 🏆 **Competition mode** with a local (or server-backed) leaderboard
- 🖼️ **Collection gallery** showing which animals you've discovered
- ✨ **"New animal!" badge** on first-time discoveries
- 🔉 Synthesised camera-shutter sound (no audio assets shipped)

## Project structure

```
.
├── client/         # React + Vite + Tailwind front end
│   └── src/
│       ├── components/
│       ├── data/animals.js
│       └── lib/
└── server/         # Express server with in-memory leaderboard
```

## Quick start

```bash
# install all workspaces
npm run install:all

# run client (5173) and server (3001) together
npm run dev
```

Then open <http://localhost:5173> and grant camera permission.

### Run them separately

```bash
node server/index.js          # http://localhost:3001
npm --prefix client run dev   # http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend, so the client always calls relative paths.

## Notes

- The MVP does **not** use any external AI/vision services. "Detection" is a weighted random pick from `client/src/data/animals.js` (rarer = less likely).
- The leaderboard is in-memory and resets when the server restarts. The game still works fully if the server isn't running — it just falls back to a client-only leaderboard.
- All images are loaded from Wikimedia Commons. If a URL fails, the projector view falls back to a colored placeholder so the experience never breaks.

## Tech

- React 18, Vite 5, TailwindCSS 3
- Express 4 + cors
- Browser APIs: WebRTC, `speechSynthesis`, `AudioContext`
