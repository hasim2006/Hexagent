import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, Brain } from 'lucide-react';
import { speakText, stopVoice, getTimeGreeting } from '../../os/voice';

// ─── Config ─────────────────────────────────────────────────────────────────
// Replace this file at public/ceo-voice.mp3 to change the audio without code changes.
const AUDIO_SRC = '/ceo-voice.mp3';

function getBriefingSentences(): string[] {
  const { greeting } = getTimeGreeting();
  return [
    `${greeting}.`,
    'Based on this week\'s performance, our projected revenue opportunity has increased by 18%.',
    'AI automation content continues to deliver the strongest engagement and should remain our top priority.',
    'Your social media presence has room for improvement — posting frequency and consistency need attention to maximize reach.',
    'Financial health remains stable, and we\'re on track to close two client deals today.',
    'Current monthly revenue stands at approximately ₹3.4 lakhs with healthy cash flow.',
    'All systems are operating normally, and your AI workforce is ready for the next command.',
  ];
}

// Estimated seconds per sentence (for fallback timing when no audio loaded)
const SENTENCE_DURATIONS = [2.5, 4.5, 4.5, 6, 4, 4, 4];

// ─── Component ──────────────────────────────────────────────────────────────

export default function CEOBriefing() {
  const [active, setActive] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [sentences, setSentences] = useState<string[]>(getBriefingSentences);

  useEffect(() => {
    setSentences(getBriefingSentences());
  }, [playing]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  const sentenceStartsRef = useRef<number[]>([]);
  const totalDurationRef = useRef(0);

  // Compute sentence start times
  useEffect(() => {
    let acc = 0;
    sentenceStartsRef.current = SENTENCE_DURATIONS.map((d) => {
      const start = acc;
      acc += d;
      return start;
    });
    totalDurationRef.current = acc;
  }, []);

  // Initialize audio
  useEffect(() => {
    if (!active) return;
    const audio = new Audio(AUDIO_SRC);
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;

    const onLoaded = () => {
      setDuration(audio.duration || totalDurationRef.current);
      setAudioAvailable(true);
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setPlaying(false);
      setActive(false);
      setCurrentSentenceIdx(0);
      setTypedText('');
    };
    const onError = () => {
      setAudioAvailable(false);
      setDuration(totalDurationRef.current);
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.pause();
      audioRef.current = null;
    };
  }, [active]); // eslint-disable-line

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Determine current sentence from audio time
  useEffect(() => {
    if (!playing) return;
    const effectiveTime = audioAvailable ? currentTime : (currentTime || 0);
    const starts = sentenceStartsRef.current;
    let idx = 0;
    for (let i = 0; i < starts.length; i++) {
      if (effectiveTime >= starts[i]) idx = i;
    }
    setCurrentSentenceIdx(idx);
  }, [currentTime, playing, audioAvailable]);

  // Typing effect for current sentence
  useEffect(() => {
    if (!playing) return;
    const sentence = sentences[currentSentenceIdx] || '';
    const starts = sentenceStartsRef.current;
    const sentenceStart = starts[currentSentenceIdx] || 0;
    const sentenceDur = SENTENCE_DURATIONS[currentSentenceIdx] || 3;
    const effectiveTime = audioAvailable ? currentTime : (currentTime || 0);
    const localTime = effectiveTime - sentenceStart;
    const progress = Math.max(0, Math.min(1, localTime / sentenceDur));
    const charCount = Math.floor(sentence.length * progress);
    setTypedText(sentence.slice(0, charCount));
  }, [currentTime, currentSentenceIdx, playing, audioAvailable, sentences]);

  // Fallback timing when audio not available
  useEffect(() => {
    if (!playing || audioAvailable) return;
    const start = currentTime;
    const tick = () => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      setCurrentTime(elapsed);
      if (elapsed >= totalDurationRef.current) {
        setPlaying(false);
        setCurrentSentenceIdx(0);
        setTypedText('');
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    const startRef = { current: Date.now() - start * 1000 };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, audioAvailable]); // eslint-disable-line

  // Voice speech synthesis for fallback/live AI voice
  useEffect(() => {
    if (!playing || audioAvailable) return;
    const sentence = sentences[currentSentenceIdx];
    if (sentence) {
      speakText(sentence, {
        chime: currentSentenceIdx === 0 ? 'welcome' : 'blip',
        rate: 1.03,
        pitch: 1.18,
      });
    }
  }, [currentSentenceIdx, playing, audioAvailable, sentences]);

  const handlePlay = useCallback(() => {
    setActive(true);
    if (audioAvailable && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked — switch to live AI voice engine
        setAudioAvailable(false);
        setPlaying(true);
      });
      setPlaying(true);
    } else {
      // Live AI voice mode
      setPlaying(true);
    }
  }, [audioAvailable]);

  const handlePause = useCallback(() => {
    if (audioAvailable && audioRef.current) {
      audioRef.current.pause();
    }
    stopVoice();
    setPlaying(false);
    setActive(false);
  }, [audioAvailable]);

  const handleReplay = useCallback(() => {
    setActive(true);
    stopVoice();
    if (audioAvailable && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
    setCurrentTime(0);
    setCurrentSentenceIdx(0);
    setTypedText('');
    setPlaying(true);
  }, [audioAvailable]);

  const handleDismiss = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    stopVoice();
    setPlaying(false);
    setActive(false);
    setDismissed(true);
  }, []);

  if (dismissed) return null;

  return (
    <>
      <CameraEffects playing={playing} />
      {active && playing && (
        <CEOHologram
          playing={playing}
          currentTime={currentTime}
          currentSentenceIdx={currentSentenceIdx}
          typedText={typedText}
        />
      )}
      {active && playing && (
        <BriefingPanel
          sentences={sentences}
          currentIdx={currentSentenceIdx}
          typedText={typedText}
          playing={playing}
        />
      )}
      <AudioControls
        playing={playing}
        onPlay={handlePlay}
        onPause={handlePause}
        onReplay={handleReplay}
        volume={volume}
        muted={muted}
        onVolumeChange={setVolume}
        onToggleMute={() => setMuted((m) => !m)}
        onDismiss={handleDismiss}
        currentTime={currentTime}
        duration={duration || totalDurationRef.current}
        audioAvailable={audioAvailable}
      />
    </>
  );
}

// ─── Camera Effects ─────────────────────────────────────────────────────────

function CameraEffects({ playing }: { playing: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[90] pointer-events-none transition-all duration-[2000ms] ease-in-out"
      style={{
        transform: playing ? 'scale(1.04)' : 'scale(1)',
        transformOrigin: 'center 40%',
      }}
    >
      {/* Depth of field vignette */}
      <div
        className="absolute inset-0 transition-opacity duration-[2000ms]"
        style={{
          opacity: playing ? 1 : 0,
          background: playing
            ? 'radial-gradient(ellipse at 50% 40%, rgba(255,102,214,0.14) 0%, rgba(0,240,255,0.06) 35%, rgba(0,0,0,0.3) 100%)'
            : 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,240,255,0.04) 60%, rgba(0,0,0,0.3) 100%)',
        }}
      />
      {/* Soft breathing motion overlay */}
      {playing && (
        <div
          className="absolute inset-0"
          style={{ animation: 'camera-breathe 8s ease-in-out infinite' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(255,95,180,0.12), rgba(0,240,255,0.03) 45%, transparent 70%)' }}
          />
        </div>
      )}
      <style>{`
        @keyframes camera-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.008); }
        }
      `}</style>
    </div>
  );
}

// ─── CEO Hologram ────────────────────────────────────────────────────────────

function CEOHologram({
  playing,
  currentTime,
  currentSentenceIdx,
  typedText,
}: {
  playing: boolean;
  currentTime: number;
  currentSentenceIdx: number;
  typedText: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 220;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, size, size);
      ctx.save();

      const cx = size / 2;
      const cy = size / 2;

      const breathY = Math.sin(t * 1.2) * 2.5;
      const headY = cy - 18 + breathY;
      const glowIntensity = playing ? 0.7 + Math.sin(t * 3) * 0.2 : 0.25 + Math.sin(t * 1.4) * 0.05;
      const speechEnergy = playing
        ? Math.max(0.2, Math.min(1, 0.35 + Math.abs(Math.sin((currentTime + currentSentenceIdx * 0.4) * 8 + typedText.length * 0.02)) * 0.65))
        : 0.15;
      const blinkPhase = playing
        ? (Math.sin(t * 2.3 + currentSentenceIdx * 0.5) > 0.98 ? 0.16 : 1)
        : (Math.sin(t * 0.8) > 0.96 ? 0.14 : 1);
      const browLift = playing ? Math.sin(t * 1.6 + currentSentenceIdx * 0.3) * 2.8 : 0;
      const mouthOpen = playing ? 1.8 + speechEnergy * 9.6 + Math.sin(t * 10 + currentTime * 1.2) * 0.6 : 1.3;
      const mouthWidth = 7 + speechEnergy * 2.3;
      const ringPulse = playing ? Math.sin(t * 4) * 0.5 + 0.5 : Math.sin(t * 1.5) * 0.3 + 0.3;
      const ringRadius = 74 + ringPulse * 16;

      const halo = ctx.createRadialGradient(cx, headY, 10, cx, headY, 95);
      halo.addColorStop(0, `rgba(0, 240, 255, ${0.16 + glowIntensity * 0.2})`);
      halo.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, headY, 95, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(0, 240, 255, ${playing ? 0.4 + ringPulse * 0.25 : 0.16})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy + 58, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(0, 240, 255, ${playing ? 0.2 : 0.08})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy + 58, ringRadius + 20 + ringPulse * 10, 0, Math.PI * 2);
      ctx.stroke();

      const faceGrad = ctx.createLinearGradient(cx - 44, headY - 46, cx + 46, headY + 48);
      faceGrad.addColorStop(0, 'rgba(7, 40, 62, 0.98)');
      faceGrad.addColorStop(0.3, 'rgba(0, 240, 255, 0.2)');
      faceGrad.addColorStop(0.65, 'rgba(255, 94, 188, 0.16)');
      faceGrad.addColorStop(1, 'rgba(4, 18, 34, 0.98)');
      ctx.fillStyle = faceGrad;
      ctx.beginPath();
      ctx.arc(cx, headY, 42, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(0, 240, 255, ${0.25 + glowIntensity * 0.18})`;
      ctx.strokeStyle = `rgba(0, 240, 255, ${0.6 + glowIntensity * 0.25})`;
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.arc(cx, headY, 42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(255,255,255,0.08)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 24, headY + 2);
      ctx.quadraticCurveTo(cx, headY + 24, cx + 24, headY + 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 16, headY - 8 - browLift);
      ctx.quadraticCurveTo(cx - 6, headY - 19 - browLift, cx + 2, headY - 11 - browLift);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 16, headY - 8 - browLift);
      ctx.quadraticCurveTo(cx + 6, headY - 19 - browLift, cx - 2, headY - 11 - browLift);
      ctx.stroke();

      [-10, 10].forEach((dx) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * blinkPhase})`;
        ctx.beginPath();
        ctx.arc(cx + dx, headY - 2, 3.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(0, 240, 255, ${0.25 * blinkPhase})`;
        ctx.beginPath();
        ctx.arc(cx + dx, headY - 2, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = `rgba(0, 240, 255, ${0.3 + speechEnergy * 0.5})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 5, headY + 13);
      ctx.quadraticCurveTo(cx, headY + 14 + mouthOpen * 0.6, cx + 5, headY + 13);
      ctx.stroke();

      ctx.strokeStyle = `rgba(0, 240, 255, ${0.22 + speechEnergy * 0.45})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(cx, headY + 16, mouthWidth, Math.max(1.3, mouthOpen * 0.45), 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 94, 188, ${0.25 + glowIntensity * 0.12})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - 34, cy + 30 + breathY);
      ctx.quadraticCurveTo(cx, cy + 8 + breathY, cx + 34, cy + 30 + breathY);
      ctx.stroke();

      if (playing) {
        for (let i = 0; i < 4; i++) {
          const waveT = (t * 0.8 + i * 0.28) % 1;
          const waveR = 40 + waveT * 78;
          ctx.strokeStyle = `rgba(0, 240, 255, ${(1 - waveT) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(cx, headY, waveR, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      for (let i = 0; i < 8; i++) {
        const pT = (t * 0.3 + i * 0.5) % 1;
        const angle = (i / 8) * Math.PI * 2 + t * 0.1;
        const pr = 90 - pT * 60;
        const px = cx + Math.cos(angle) * pr;
        const py = headY + Math.sin(angle) * pr * 0.5;
        ctx.fillStyle = `rgba(0, 240, 255, ${(1 - pT) * 0.4})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, currentTime, currentSentenceIdx, typedText]);

  return (
    <div
      className="fixed z-[95] pointer-events-none transition-all duration-[2000ms] ease-in-out"
      style={{
        top: '50%',
        left: '50%',
        transform: playing ? 'translate(-50%, -55%) scale(1.15) rotateX(8deg)' : 'translate(-50%, -50%) scale(0.92)',
        opacity: playing ? 1 : 0,
        filter: playing ? 'drop-shadow(0 0 32px rgba(0,240,255,0.35))' : 'drop-shadow(0 0 6px rgba(0,0,0,0.2))',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-all duration-[2000ms]"
        style={{
          width: '300px',
          height: '300px',
          left: '-50px',
          top: '-50px',
          background: playing ? 'radial-gradient(circle, rgba(0,240,255,0.26) 0%, rgba(255,94,188,0.16) 35%, rgba(0,0,0,0) 70%)' : 'rgba(0,240,255,0.02)',
        }}
      />
      <canvas ref={canvasRef} />
      {/* Label */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <div className="flex items-center gap-1.5 justify-center">
          <Brain className="w-3 h-3 text-neon-cyan" />
          <span className="font-mono text-[10px] text-neon-cyan tracking-wider">STRATEGIST AI</span>
        </div>
        <div className="font-mono text-[8px] text-white/30 mt-0.5">CEO BRIEFING</div>
      </div>
    </div>
  );
}

// ─── Briefing Panel ─────────────────────────────────────────────────────────

function BriefingPanel({
  sentences,
  currentIdx,
  typedText,
  playing,
}: {
  sentences: string[];
  currentIdx: number;
  typedText: string;
  playing: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [typedText, currentIdx]);

  return (
    <div
      className="fixed z-[96] transition-all duration-700 ease-out right-3 sm:right-6 max-w-[calc(100vw-24px)] w-[380px]"
      style={{
        top: '50%',
        transform: 'translateY(-50%)',
        maxHeight: '60vh',
      }}
    >
      <div
        className="rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.14)]"
        style={{
          borderColor: 'rgba(0,240,255,0.2)',
          background: 'linear-gradient(135deg, rgba(6,19,40,0.95), rgba(8,32,58,0.75))',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5" style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.08), transparent)' }}>
          <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <span className="font-mono text-xs text-neon-cyan tracking-wider font-bold">AI CEO BRIEFING</span>
          {playing && <span className="ml-auto font-mono text-[9px] text-neon-cyan animate-pulse">● LIVE VOICE</span>}
        </div>

        {/* Transcript */}
        <div ref={scrollRef} className="p-4 max-h-[50vh] overflow-y-auto no-scrollbar space-y-2">
          {sentences.map((sentence, i) => {
            const isCurrent = i === currentIdx;
            const isPast = i < currentIdx;
            return (
              <div key={i} className="transition-all duration-300">
                {isCurrent ? (
                  <p className="text-sm leading-relaxed" style={{ color: '#00f0ff' }}>
                    {typedText}
                    <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-neon-cyan animate-pulse align-middle" />
                  </p>
                ) : (
                  <p className={`text-sm leading-relaxed ${isPast ? 'text-white/50' : 'text-white/25'}`}>
                    {sentence}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / sentences.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Audio Controls ──────────────────────────────────────────────────────────

function AudioControls({
  playing,
  onPlay,
  onPause,
  onReplay,
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
  onDismiss,
  currentTime,
  duration,
  audioAvailable,
}: {
  playing: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  volume: number;
  muted: boolean;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
  onDismiss: () => void;
  currentTime: number;
  duration: number;
  audioAvailable: boolean;
}) {
  const [showVolume, setShowVolume] = useState(false);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="fixed z-[97] transition-all duration-500 bottom-3 right-3 sm:bottom-6 sm:right-6 max-w-[calc(100vw-24px)]"
    >
      <div className="glass-strong rounded-2xl p-2.5 sm:p-3 flex items-center gap-1.5 sm:gap-2 shadow-2xl overflow-x-auto" style={{ borderColor: 'rgba(0,240,255,0.15)' }}>
        {/* Play / Pause */}
        <button
          onClick={playing ? onPause : onPlay}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,240,255,0.05))', border: '1px solid rgba(0,240,255,0.25)' }}
        >
          {playing ? <Pause className="w-4 h-4 text-neon-cyan" /> : <Play className="w-4 h-4 text-neon-cyan ml-0.5" />}
        </button>

        {/* Replay */}
        <button
          onClick={onReplay}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center glass hover:glass-strong transition-all flex-shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-white/60" />
        </button>

        {/* Volume */}
        <div
          className="relative flex-shrink-0"
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <button
            onClick={onToggleMute}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center glass hover:glass-strong transition-all"
          >
            {muted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-white/40" /> : <Volume2 className="w-3.5 h-3.5 text-neon-cyan" />}
          </button>
          {showVolume && (
            <div className="absolute bottom-12 right-0 glass-strong rounded-xl p-3 transition-all z-10">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-20 accent-cyan-400"
                style={{ accentColor: '#00f0ff' }}
              />
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="w-16 sm:w-24 h-1.5 bg-white/10 rounded-full overflow-hidden mx-0.5 sm:mx-1 flex-shrink-0">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{ width: `${progress}%`, background: 'linear-gradient(to right, #00f0ff, #0080ff)' }}
          />
        </div>

        {/* Time */}
        <span className="font-mono text-[9px] text-white/40 w-12 sm:w-16 text-right flex-shrink-0">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/60 transition-all flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Voice indicator notice */}
      <div className="absolute -top-7 right-0 font-mono text-[9px] text-neon-cyan/70 whitespace-nowrap flex items-center gap-1.5 bg-ink-950/80 px-2.5 py-0.5 rounded-full border border-neon-cyan/20">
        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
        {audioAvailable ? 'CEO Audio Stream' : 'AI Speech Engine Active'}
      </div>
    </div>
  );
}

function formatTime(s: number): string {
  if (!s || isNaN(s)) return '0:00';
  const mins = Math.floor(s / 60);
  const secs = Math.floor(s % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
