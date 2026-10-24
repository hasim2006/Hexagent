import { useEffect, useState } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

const BOOT_LINES = [
  'Initializing Autonomous Workforce...',
  'Loading AI Employees...',
  'Connecting Intelligence Network...',
  'System Ready.',
];

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let raf = 0;
    let p = 0;
    const tick = () => {
      p += 0.4 + Math.random() * 0.8;
      if (p >= 100) p = 100;
      setProgress(p);
      const idx = Math.min(Math.floor((p / 100) * BOOT_LINES.length), BOOT_LINES.length - 1);
      setLineIndex(idx);
      if (p >= 100) {
        setTimeout(() => setExiting(true), 600);
        setTimeout(onComplete, 1400);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-ink-950 flex flex-col items-center justify-center transition-all duration-700 ${
        exiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
      }`}
    >
      {/* animated circuit lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <defs>
          <linearGradient id="circuit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff6a00" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff6a00" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff6a00" stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1={`${(i * 8) % 100}%`}
            y1="0%"
            x2={`${(i * 8 + 30) % 100}%`}
            y2="100%"
            stroke="url(#circuit)"
            strokeWidth="1"
            style={{
              animation: `dash 2s linear infinite`,
              strokeDasharray: '20 40',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </svg>
      <style>{`@keyframes dash { to { stroke-dashoffset: -60; } }`}</style>

      {/* central logo */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* rotating ring logo */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-ember-500/30 animate-spin-slow" />
          <div className="absolute inset-2 rounded-full border border-ember-500/20 animate-spin-rev" />
          <div className="absolute inset-4 rounded-full border-2 border-ember-500/40 animate-spin-slow" style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }} />
          <div className="absolute inset-0 rounded-full bg-ember-500/10 blur-xl animate-pulse-glow" />
          <div className="relative font-display font-bold text-2xl text-ember-gradient">OS</div>
        </div>

        {/* title */}
        <div className="text-center">
          <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-gradient">
            made with Hasim
          </h1>
          <div className="font-mono text-sm tracking-ultra text-ember-500 mt-2">OPERATING SYSTEM</div>
        </div>

        {/* boot lines */}
        <div className="h-6 font-mono text-sm text-white/60 min-w-[320px] text-center">
          <span className="text-ember-500">{'>'}</span> {BOOT_LINES[lineIndex]}
        </div>

        {/* progress bar */}
        <div className="w-64 md:w-80 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-ember-600 to-ember-400 rounded-full transition-all duration-100"
            style={{ width: `${progress}%`, boxShadow: '0 0 12px rgba(255,106,0,0.6)' }}
          />
        </div>
        <div className="font-mono text-xs text-white/40">{Math.floor(progress)}%</div>
      </div>
    </div>
  );
}
