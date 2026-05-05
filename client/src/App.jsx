import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CameraView from './components/CameraView.jsx';
import ProjectorView from './components/ProjectorView.jsx';
import ScoreBoard from './components/ScoreBoard.jsx';
import Gallery from './components/Gallery.jsx';
import BadgeToast from './components/BadgeToast.jsx';
import { animals } from './data/animals.js';
import { fetchLeaderboard, submitScore } from './lib/api.js';

const RARITY_WEIGHTS = { common: 5, rare: 2, 'very rare': 1 };
const FIRST_DISCOVERY_BONUS = 5;

function detectAnimal() {
  const total = animals.reduce(
    (sum, a) => sum + (RARITY_WEIGHTS[a.rarity] ?? 1),
    0,
  );
  let r = Math.random() * total;
  for (const a of animals) {
    const w = RARITY_WEIGHTS[a.rarity] ?? 1;
    if (r < w) return a;
    r -= w;
  }
  return animals[animals.length - 1];
}

function pointsFor(animal, isFirstDiscovery) {
  const base = 1;
  const rarityBonus = (animal.rarityScore || 1) - 1;
  const discovery = isFirstDiscovery ? FIRST_DISCOVERY_BONUS : 0;
  return base + rarityBonus + discovery;
}

export default function App() {
  const [mode, setMode] = useState('idle'); // idle | camera | revealing
  const [score, setScore] = useState(0);
  const [captures, setCaptures] = useState([]); // { animalId, points, ts }
  const [discoveredIds, setDiscoveredIds] = useState(() => new Set());
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [pendingPoints, setPendingPoints] = useState(0);
  const [pendingNewBadge, setPendingNewBadge] = useState(null);

  const [competitionMode, setCompetitionMode] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [serverOnline, setServerOnline] = useState(false);

  const [galleryOpen, setGalleryOpen] = useState(false);

  // ----- Leaderboard sync -----
  const refreshLeaderboard = useCallback(async () => {
    const res = await fetchLeaderboard();
    if (res.ok) {
      setServerOnline(true);
      setLeaderboard(res.entries);
    } else {
      setServerOnline(false);
    }
  }, []);

  useEffect(() => {
    if (competitionMode) refreshLeaderboard();
  }, [competitionMode, refreshLeaderboard]);

  // ----- Derived -----
  const totalCaptures = captures.length;
  const rareCaptures = useMemo(
    () =>
      captures.filter((c) => {
        const a = animals.find((x) => x.id === c.animalId);
        return a && (a.rarity === 'rare' || a.rarity === 'very rare');
      }).length,
    [captures],
  );

  // Local fallback leaderboard that includes the current player.
  const effectiveLeaderboard = useMemo(() => {
    if (!competitionMode || !playerName) return leaderboard;
    if (serverOnline) return leaderboard;
    const others = leaderboard.filter((e) => e.playerName !== playerName);
    return [...others, { playerName, score, rare: rareCaptures }].sort(
      (a, b) => b.score - a.score || b.rare - a.rare,
    );
  }, [competitionMode, playerName, leaderboard, score, rareCaptures, serverOnline]);

  // ----- Handlers -----
  function handleStart() {
    setMode('camera');
  }

  function handleCapture() {
    const animal = detectAnimal();
    const isNew = !discoveredIds.has(animal.id);
    const pts = pointsFor(animal, isNew);

    setCurrentAnimal(animal);
    setPendingPoints(pts);
    setScore((s) => s + pts);
    setCaptures((list) => [
      ...list,
      { animalId: animal.id, points: pts, ts: Date.now() },
    ]);
    if (isNew) {
      setDiscoveredIds((s) => {
        const next = new Set(s);
        next.add(animal.id);
        return next;
      });
      setPendingNewBadge(animal);
    }
    setMode('revealing');
  }

  // Push score to leaderboard whenever it changes during competition mode.
  const lastSubmittedRef = useRef({ score: -1, rare: -1 });
  useEffect(() => {
    if (!competitionMode || !playerName) return;
    const last = lastSubmittedRef.current;
    if (last.score === score && last.rare === rareCaptures) return;
    lastSubmittedRef.current = { score, rare: rareCaptures };
    (async () => {
      const res = await submitScore({ playerName, score, rare: rareCaptures });
      if (res.ok) {
        setServerOnline(true);
        setLeaderboard(res.entries);
      } else {
        setServerOnline(false);
      }
    })();
  }, [score, rareCaptures, competitionMode, playerName]);

  function closeProjector() {
    setMode('camera');
    setCurrentAnimal(null);
  }

  function toggleCompetition() {
    if (competitionMode) {
      setCompetitionMode(false);
      return;
    }
    const name = (window.prompt('Enter your player name', playerName || 'Explorer') || '').trim();
    if (!name) return;
    setPlayerName(name.slice(0, 32));
    setCompetitionMode(true);
  }

  function resetGame() {
    if (!window.confirm('Reset your score and start over?')) return;
    setScore(0);
    setCaptures([]);
    setDiscoveredIds(new Set());
    setCurrentAnimal(null);
    setPendingPoints(0);
    setMode('idle');
  }

  // ----- Render -----
  return (
    <div className="min-h-full">
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 pt-6 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden>📸</span>
          <div>
            <h1 className="font-display text-3xl leading-none text-jungle-900">WildSnap</h1>
            <p className="text-sm text-jungle-700/80">Snap, spot, discover rare animals!</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className={competitionMode ? 'ws-btn-sun' : 'ws-btn-ghost'}
            onClick={toggleCompetition}
            type="button"
          >
            {competitionMode ? '🏆 Competition: ON' : '🏆 Competition: OFF'}
          </button>
          <button className="ws-btn-ghost" onClick={() => setGalleryOpen(true)} type="button">
            🖼️ Gallery
          </button>
          <button className="ws-btn-ghost" onClick={resetGame} type="button" title="Reset score">
            ↺ Reset
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-5 px-4 pb-12 pt-6 sm:px-6 lg:grid-cols-[1fr_320px]">
        <section className="order-2 lg:order-1">
          {mode === 'idle' && <IdleHero onStart={handleStart} />}
          {(mode === 'camera' || mode === 'revealing') && (
            <CameraView onCapture={handleCapture} onCancel={() => setMode('idle')} />
          )}
        </section>

        <aside className="order-1 lg:order-2">
          <ScoreBoard
            score={score}
            totalCaptures={totalCaptures}
            rareCaptures={rareCaptures}
            competitionMode={competitionMode}
            playerName={playerName}
            leaderboard={effectiveLeaderboard}
            serverOnline={serverOnline}
          />
          <div className="mt-3 ws-card p-4 text-sm leading-relaxed text-jungle-900/80">
            <p className="font-display text-jungle-900">How to play</p>
            <ol className="mt-1 list-decimal pl-5 space-y-1">
              <li>Open the camera and aim at anything!</li>
              <li>Tap <strong>Capture</strong> to snap a creature.</li>
              <li>Read the fun fact. Listen to its name.</li>
              <li>Hunt for very rare animals — they’re worth more.</li>
            </ol>
          </div>
        </aside>
      </main>

      {mode === 'revealing' && currentAnimal && (
        <ProjectorView
          animal={currentAnimal}
          isNewDiscovery={pendingNewBadge && pendingNewBadge.id === currentAnimal.id}
          pointsAwarded={pendingPoints}
          onClose={closeProjector}
        />
      )}

      <BadgeToast
        animal={pendingNewBadge}
        onDone={() => setPendingNewBadge(null)}
      />

      {galleryOpen && (
        <Gallery discoveredIds={discoveredIds} onClose={() => setGalleryOpen(false)} />
      )}

      <footer className="mx-auto max-w-5xl px-4 pb-6 text-center text-xs text-jungle-700/60 sm:px-6">
        Built for curious explorers. Camera stays on your device — nothing is uploaded.
      </footer>
    </div>
  );
}

function IdleHero({ onStart }) {
  return (
    <div className="ws-card flex flex-col items-center gap-5 p-8 text-center sm:p-12">
      <div className="text-7xl" aria-hidden>🦊🦎🦓</div>
      <h2 className="font-display text-3xl text-jungle-900 sm:text-4xl">
        Ready to discover wild animals?
      </h2>
      <p className="max-w-md text-jungle-900/80">
        Aim your camera, line up the reticle, and tap <strong>Capture</strong>. WildSnap will tell
        you what rare creature you just spotted — and teach you something cool about it.
      </p>
      <button className="ws-btn-primary text-xl" onClick={onStart} type="button">
        🚀 Start camera
      </button>
    </div>
  );
}
