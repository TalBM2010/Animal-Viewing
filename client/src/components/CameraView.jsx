import { useEffect, useRef, useState } from 'react';
import { playShutter } from '../lib/sound.js';

const PERMISSION_DENIED = 'denied';
const PERMISSION_UNSUPPORTED = 'unsupported';
const PERMISSION_ERROR = 'error';

export default function CameraView({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('initializing'); // initializing | live | error | denied | unsupported
  const [errorKind, setErrorKind] = useState(null);
  const [flashing, setFlashing] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorKind(PERMISSION_UNSUPPORTED);
        setStatus('error');
        return;
      }
      try {
        let stream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' } },
            audio: false,
          });
        } catch {
          // Fallback to any available camera (e.g. desktop with no rear cam)
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setStatus('live');
      } catch (err) {
        if (cancelled) return;
        if (err && (err.name === 'NotAllowedError' || err.name === 'SecurityError')) {
          setErrorKind(PERMISSION_DENIED);
        } else {
          setErrorKind(PERMISSION_ERROR);
        }
        setStatus('error');
      }
    }
    start();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  async function retry() {
    setStatus('initializing');
    setErrorKind(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus('live');
    } catch (err) {
      setErrorKind(err && err.name === 'NotAllowedError' ? PERMISSION_DENIED : PERMISSION_ERROR);
      setStatus('error');
    }
  }

  function capture() {
    if (status !== 'live' || busy) return;
    setBusy(true);
    playShutter();
    setFlashing(true);

    // Freeze the current frame onto a canvas (used purely for the visual feel —
    // we don't actually run vision on it for the MVP).
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // Brief pause for the flash, then bubble up.
    window.setTimeout(() => {
      setFlashing(false);
      setBusy(false);
      onCapture && onCapture();
    }, 360);
  }

  return (
    <div className="ws-card overflow-hidden p-3 sm:p-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
          autoPlay
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Reticle overlay */}
        {status === 'live' && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-[60%] w-[60%] max-h-[420px] max-w-[420px] animate-reticle-pulse">
              {/* corner brackets */}
              <span className="absolute left-0 top-0 h-10 w-10 border-l-4 border-t-4 border-sunshine-400 rounded-tl-2xl" />
              <span className="absolute right-0 top-0 h-10 w-10 border-r-4 border-t-4 border-sunshine-400 rounded-tr-2xl" />
              <span className="absolute bottom-0 left-0 h-10 w-10 border-b-4 border-l-4 border-sunshine-400 rounded-bl-2xl" />
              <span className="absolute bottom-0 right-0 h-10 w-10 border-b-4 border-r-4 border-sunshine-400 rounded-br-2xl" />
              {/* crosshair */}
              <span className="absolute left-1/2 top-1/2 h-10 w-px -translate-x-1/2 -translate-y-1/2 bg-sunshine-400/80" />
              <span className="absolute left-1/2 top-1/2 h-px w-10 -translate-x-1/2 -translate-y-1/2 bg-sunshine-400/80" />
              {/* center ring */}
              <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70" />
            </div>
          </div>
        )}

        {/* status label */}
        {status === 'live' && (
          <div className="absolute left-3 top-3 ws-chip bg-black/60 text-white">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> LIVE
          </div>
        )}

        {/* loading */}
        {status === 'initializing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 text-white">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-sunshine-400" />
            <p className="font-display text-lg">Waking up the camera…</p>
          </div>
        )}

        {/* error / denied */}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 p-6 text-center text-white">
            <div className="text-5xl">📷</div>
            {errorKind === PERMISSION_DENIED && (
              <>
                <h3 className="font-display text-2xl">Camera access denied</h3>
                <p className="max-w-sm text-white/80">
                  WildSnap needs your camera to spot animals. Please allow camera access in your
                  browser settings and try again.
                </p>
              </>
            )}
            {errorKind === PERMISSION_UNSUPPORTED && (
              <>
                <h3 className="font-display text-2xl">No camera support</h3>
                <p className="max-w-sm text-white/80">
                  This browser doesn’t support camera access. Try a modern Chrome, Edge, Firefox,
                  or Safari on a device with a camera.
                </p>
              </>
            )}
            {errorKind === PERMISSION_ERROR && (
              <>
                <h3 className="font-display text-2xl">We couldn’t open the camera</h3>
                <p className="max-w-sm text-white/80">
                  Another app might be using it, or there might be no camera attached.
                </p>
              </>
            )}
            <div className="flex gap-3">
              <button className="ws-btn-sun" onClick={retry}>Try again</button>
              {onCancel && (
                <button className="ws-btn-ghost" onClick={onCancel}>Back</button>
              )}
            </div>
          </div>
        )}

        {/* white flash */}
        {flashing && (
          <div className="pointer-events-none absolute inset-0 bg-white animate-flash-white" />
        )}
      </div>

      {/* controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button className="ws-btn-ghost" onClick={onCancel} type="button">
          ← Back
        </button>
        <button
          className="ws-btn-primary text-2xl px-10 py-4 ring-4 ring-jungle-200"
          onClick={capture}
          type="button"
          disabled={status !== 'live' || busy}
          aria-label="Capture"
        >
          📸 Capture!
        </button>
        <span className="hidden w-[5.5rem] sm:inline-block" aria-hidden />
      </div>
    </div>
  );
}
