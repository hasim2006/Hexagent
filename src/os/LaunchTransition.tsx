import { useEffect, useState } from 'react';
import ParticleField from '../components/ParticleField';

const BOOT_STEPS = [
  'Connecting AI Employees...',
  'Synchronizing Memory...',
  'Loading Company Data...',
  'Workforce Online.',
];

export default function LaunchTransition({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0); // 0: flythrough, 1: doors, 2: scan, 3: assemble, 4: power on, 5: boot text
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase(1), 800));
    timers.push(window.setTimeout(() => setPhase(2), 1600));
    timers.push(window.setTimeout(() => setPhase(3), 2400));
    timers.push(window.setTimeout(() => setPhase(4), 3200));
    timers.push(window.setTimeout(() => setPhase(5), 3800));
    timers.push(window.setTimeout(onComplete, 5500));

    // boot steps
    BOOT_STEPS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStep(i), 4000 + i * 350));
    });

    // progress
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 2, 100));
    }, 50);
    timers.push(interval as unknown as number);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] bg-ink-950 overflow-hidden">
      {/* particle field */}
      <div className="absolute inset-0">
        <ParticleField density={50} color="#00f0ff" speed={0.5} connect />
      </div>

      {/* Phase 0: Flythrough — zooming lines */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${phase === 0 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border border-neon-cyan/30"
              style={{
                width: `${100 + i * 200}px`,
                height: `${100 + i * 200}px`,
                animation: `zoom-in 1s ease-out ${i * 0.1}s forwards`,
                opacity: 0,
              }}
            />
          ))}
        </div>
        <style>{`@keyframes zoom-in { from { transform: scale(0); opacity: 0.8; } to { transform: scale(3); opacity: 0; } }`}</style>
      </div>

      {/* Phase 1: Glass doors opening */}
      <div className={`absolute inset-0 transition-all duration-700 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div
          className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-ink-900 to-ink-800 border-r border-neon-cyan/30 transition-transform duration-1000 ${phase >= 1 ? '-translate-x-full' : 'translate-x-0'}`}
          style={{ transformOrigin: 'left' }}
        >
          <div className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs text-neon-cyan/50 tracking-ultra">ACCESS</div>
        </div>
        <div
          className={`absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-ink-900 to-ink-800 border-l border-neon-cyan/30 transition-transform duration-1000 ${phase >= 1 ? 'translate-x-full' : 'translate-x-0'}`}
          style={{ transformOrigin: 'right' }}
        >
          <div className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-xs text-neon-cyan/50 tracking-ultra">GRANTED</div>
        </div>
      </div>

      {/* Phase 2: Security scan */}
      {phase >= 2 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/40 animate-spin-slow" style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }} />
            <div className="absolute inset-4 rounded-full border border-neon-cyan/30 animate-spin-rev" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-mono text-xs text-neon-cyan tracking-ultra">SCANNING</div>
            </div>
            {/* scan line */}
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <div className="absolute left-0 right-0 h-0.5 bg-neon-cyan glow-cyan" style={{ animation: 'scan-vert 1s ease-in-out infinite' }} />
            </div>
            <style>{`@keyframes scan-vert { 0%,100% { top: 10%; } 50% { top: 90%; } }`}</style>
          </div>
        </div>
      )}

      {/* Phase 3: Digital particles assembling */}
      {phase >= 3 && (
        <div className="absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 30 }).map((_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const dist = 200;
            return (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-neon-cyan"
                style={{
                  left: '50%',
                  top: '50%',
                  animation: `assemble 0.8s ease-out ${i * 0.02}s forwards`,
                  '--start-x': `${Math.cos(angle) * dist}px`,
                  '--start-y': `${Math.sin(angle) * dist}px`,
                } as React.CSSProperties}
              />
            );
          })}
          <style>{`@keyframes assemble { from { transform: translate(var(--start-x), var(--start-y)); opacity: 0; } to { transform: translate(0, 0); opacity: 1; } }`}</style>
        </div>
      )}

      {/* Phase 4: Holographic interface powers on */}
      {phase >= 4 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ animation: 'power-on 0.6s ease-out forwards' }}>
            <div className="absolute -inset-8 rounded-full bg-neon-cyan/20 blur-2xl animate-pulse-glow" />
            <div className="relative font-display text-4xl md:text-6xl font-bold text-neon-cyan">
              made with Hasim
            </div>
            <div className="text-center mt-2 font-mono text-sm tracking-ultra text-white/60">COMMAND CENTER</div>
          </div>
          <style>{`@keyframes power-on { from { opacity: 0; transform: scale(0.8); filter: blur(20px); } to { opacity: 1; transform: scale(1); filter: blur(0); } }`}</style>
        </div>
      )}

      {/* Phase 5: Boot sequence text */}
      {phase >= 5 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 md:w-96">
          <div className="space-y-2 mb-4">
            {BOOT_STEPS.map((s, i) => (
              <div
                key={s}
                className="flex items-center gap-2 font-mono text-sm transition-all duration-300"
                style={{
                  opacity: i <= step ? 1 : 0.2,
                  transform: i <= step ? 'translateX(0)' : 'translateX(-10px)',
                }}
              >
                <span className="text-neon-cyan">{i < step ? '✓' : i === step ? '⟳' : '○'}</span>
                <span className={i < step ? 'text-white/60' : i === step ? 'text-neon-cyan' : 'text-white/20'}>
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-neon-blue to-neon-cyan rounded-full transition-all duration-100" style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(0,240,255,0.6)' }} />
          </div>
        </div>
      )}

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)' }} />
    </div>
  );
}
