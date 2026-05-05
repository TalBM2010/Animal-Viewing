// Synthesised camera-shutter "click" — no audio assets required.
// Generated with the Web Audio API: a short noise burst with a fast decay
// envelope, layered with a brief tonal "snap" for character.

let ctx = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (ctx) return ctx;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  return ctx;
}

export function playShutter() {
  const audio = getContext();
  if (!audio) return;
  // Some browsers suspend the context until a user gesture — resume on demand.
  if (audio.state === 'suspended') {
    audio.resume().catch(() => {});
  }

  const now = audio.currentTime;

  // Noise burst (the "shhk")
  const bufferSize = Math.floor(audio.sampleRate * 0.12);
  const noiseBuffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const noise = audio.createBufferSource();
  noise.buffer = noiseBuffer;

  const noiseFilter = audio.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1500;

  const noiseGain = audio.createGain();
  noiseGain.gain.setValueAtTime(0.6, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  noise.connect(noiseFilter).connect(noiseGain).connect(audio.destination);
  noise.start(now);
  noise.stop(now + 0.13);

  // Tonal click (the "ka")
  const osc = audio.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(1800, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);

  const oscGain = audio.createGain();
  oscGain.gain.setValueAtTime(0.18, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(oscGain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}
