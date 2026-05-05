import { useState } from 'react';
import { animals } from '../data/animals.js';

export default function Gallery({ discoveredIds, onClose }) {
  const [imageFails, setImageFails] = useState({});
  const discoveredCount = animals.filter((a) => discoveredIds.has(a.id)).length;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-jungle-900/80 p-4 backdrop-blur-sm">
      <div className="ws-card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl">Your Collection</h2>
            <p className="text-sm text-jungle-700/80">
              {discoveredCount} of {animals.length} animals discovered
            </p>
          </div>
          <button className="ws-btn-ghost" onClick={onClose} type="button">
            Close ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {animals.map((a) => {
            const found = discoveredIds.has(a.id);
            const failed = imageFails[a.id];
            return (
              <div
                key={a.id}
                className={`rounded-2xl border-2 p-3 transition ${
                  found
                    ? 'border-jungle-400 bg-white'
                    : 'border-dashed border-jungle-200 bg-jungle-50'
                }`}
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-jungle-50">
                  {found && !failed ? (
                    <img
                      src={a.image}
                      alt={a.name}
                      className="h-full w-full object-cover"
                      onError={() => setImageFails((m) => ({ ...m, [a.id]: true }))}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl">
                      {found ? <span aria-hidden>{a.emoji}</span> : <span aria-hidden>❔</span>}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div className="font-display text-sm text-jungle-900">
                    {found ? a.name : '???'}
                  </div>
                  <div className="text-[0.7rem] uppercase tracking-wider text-jungle-700/70">
                    {found ? a.rarity : 'undiscovered'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
