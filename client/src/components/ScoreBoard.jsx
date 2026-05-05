export default function ScoreBoard({
  score,
  totalCaptures,
  rareCaptures,
  competitionMode,
  playerName,
  leaderboard,
  serverOnline,
}) {
  return (
    <div className="ws-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-jungle-900">Scoreboard</h3>
          {competitionMode && playerName && (
            <p className="text-sm text-jungle-700/80">
              Playing as <span className="font-semibold">{playerName}</span>
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Stat label="Score" value={score} accent="bg-sunshine-400 text-jungle-900" />
          <Stat label="Captures" value={totalCaptures} accent="bg-jungle-500 text-white" />
          <Stat label="Rare" value={rareCaptures} accent="bg-sky2-500 text-white" />
        </div>
      </div>

      {competitionMode && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-display text-jungle-900">🏆 Leaderboard</span>
            <span className="text-jungle-700/70">
              {serverOnline ? 'Synced with server' : 'Offline (local only)'}
            </span>
          </div>
          {leaderboard.length === 0 ? (
            <p className="rounded-xl bg-jungle-50 p-3 text-sm text-jungle-700/80">
              No scores yet. Capture some animals to get on the board!
            </p>
          ) : (
            <ol className="space-y-1.5">
              {leaderboard.slice(0, 10).map((entry, idx) => {
                const isMe = entry.playerName === playerName;
                return (
                  <li
                    key={`${entry.playerName}-${idx}`}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${
                      isMe ? 'bg-sunshine-400/40 ring-2 ring-sunshine-400' : 'bg-jungle-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-display w-5 text-center">{idx + 1}</span>
                      <span className="font-semibold">{entry.playerName}</span>
                      {isMe && <span className="ws-chip bg-jungle-500 text-white text-xs">You</span>}
                    </span>
                    <span className="flex items-center gap-3 font-mono">
                      <span>{entry.score} pts</span>
                      <span className="text-jungle-700/70">{entry.rare} rare</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className={`rounded-2xl px-3 py-2 ${accent} shadow`}>
      <div className="text-[0.65rem] uppercase tracking-wider opacity-80">{label}</div>
      <div className="font-display text-2xl leading-none">{value}</div>
    </div>
  );
}
