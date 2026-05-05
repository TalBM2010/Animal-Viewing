import { useEffect } from 'react';

export default function BadgeToast({ animal, onDone, duration = 3500 }) {
  useEffect(() => {
    if (!animal) return undefined;
    const id = window.setTimeout(() => onDone && onDone(), duration);
    return () => window.clearTimeout(id);
  }, [animal && animal.id, duration, onDone]);

  if (!animal) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-3">
      <div className="ws-card pointer-events-auto flex items-center gap-3 px-4 py-3 ring-2 ring-sunshine-400 animate-toast-in">
        <span className="text-3xl" aria-hidden>{animal.emoji}</span>
        <div>
          <div className="font-display text-sm uppercase tracking-wider text-jungle-700/80">
            New animal discovered!
          </div>
          <div className="font-display text-lg text-jungle-900">{animal.name}</div>
        </div>
        <span className="ws-chip bg-sunshine-400 text-jungle-900">+5 bonus</span>
      </div>
    </div>
  );
}
