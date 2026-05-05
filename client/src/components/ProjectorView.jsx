import { useEffect, useState } from 'react';
import { speak, cancelSpeech } from '../lib/speech.js';

const RARITY_STYLES = {
  common: 'bg-jungle-100 text-jungle-700',
  rare: 'bg-sky-100 text-sky-700',
  'very rare': 'bg-amber-100 text-amber-700',
};

export default function ProjectorView({ animal, isNewDiscovery, pointsAwarded, onClose }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!animal) return undefined;
    setImageFailed(false);
    speak(`This is a ${animal.name}.`);
    return () => cancelSpeech();
  }, [animal && animal.id]);

  if (!animal) return null;

  function readFact() {
    speak(`${animal.name}. ${animal.fact}`, { rate: 0.92 });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-jungle-900/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl animate-projector-in">
        {/* Projector "stand" decoration */}
        <div className="mx-auto mb-2 h-3 w-1/3 rounded-full bg-jungle-900/40" />

        <div className="projector-screen relative overflow-hidden rounded-3xl p-6 sm:p-10">
          {isNewDiscovery && (
            <div className="absolute right-4 top-4 ws-chip bg-jungle-500 text-white shadow-lg animate-wobble">
              ✨ New discovery!
            </div>
          )}

          <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-10">
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-white/70 ring-4 ring-white shadow-inner">
              {!imageFailed ? (
                <img
                  src={animal.image}
                  alt={animal.name}
                  className="h-full w-full object-cover"
                  onError={() => setImageFailed(true)}
                  loading="eager"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-jungle-100 to-sunshine-400/40 text-center">
                  <span className="text-7xl" aria-hidden>{animal.emoji}</span>
                  <span className="font-display text-xl text-jungle-900">{animal.name}</span>
                </div>
              )}
            </div>

            <div className="text-center sm:text-left">
              <p className="font-display text-sm uppercase tracking-widest text-jungle-700/70">
                You captured a
              </p>
              <h2 className="mt-1 font-display text-4xl sm:text-5xl text-jungle-900 leading-tight">
                {animal.name} <span aria-hidden>{animal.emoji}</span>
              </h2>

              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span className="ws-chip bg-jungle-100 text-jungle-700">🌿 {animal.category}</span>
                <span className={`ws-chip ${RARITY_STYLES[animal.rarity] || RARITY_STYLES.common}`}>
                  ⭐ {animal.rarity}
                </span>
                {typeof pointsAwarded === 'number' && (
                  <span className="ws-chip bg-sunshine-400 text-jungle-900">+{pointsAwarded} pts</span>
                )}
              </div>

              <p className="mt-5 text-lg leading-relaxed text-jungle-900/90">
                {animal.fact}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
                <button className="ws-btn-primary" onClick={onClose} type="button">
                  📷 Capture another
                </button>
                <button className="ws-btn-sky" onClick={readFact} type="button">
                  🔊 Read the fact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
