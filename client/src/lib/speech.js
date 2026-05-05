// Thin wrapper around the Web Speech API. No-ops gracefully when unsupported.

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

let cachedVoice = null;

function pickVoice() {
  if (!supported) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const preferred =
    voices.find((v) => /en[-_]US/i.test(v.lang) && /female|samantha|google/i.test(v.name)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0];
  cachedVoice = preferred;
  return preferred;
}

if (supported && typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickVoice();
  };
}

export function speak(text, { rate = 0.95, pitch = 1.05, volume = 1 } = {}) {
  if (!supported || !text) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utter.voice = voice;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.volume = volume;
    window.speechSynthesis.speak(utter);
  } catch {
    // ignore — speech is best-effort
  }
}

export function cancelSpeech() {
  if (!supported) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}

export const speechSupported = supported;
