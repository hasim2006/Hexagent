import { useEffect, useState } from 'react';
import { useOS } from '../../os/store';
import { Globe } from 'lucide-react';

interface MapNode {
  name: string;
  x: number;
  y: number;
  type: 'company' | 'customer' | 'lead';
}

const NODES: MapNode[] = [
  { name: 'Mumbai', x: 68, y: 48, type: 'company' },
  { name: 'Bangalore', x: 71, y: 56, type: 'company' },
  { name: 'Delhi', x: 70, y: 40, type: 'customer' },
  { name: 'Dubai', x: 60, y: 48, type: 'customer' },
  { name: 'London', x: 47, y: 32, type: 'company' },
  { name: 'New York', x: 27, y: 38, type: 'customer' },
  { name: 'San Francisco', x: 15, y: 40, type: 'company' },
  { name: 'Tokyo', x: 85, y: 40, type: 'customer' },
  { name: 'Singapore', x: 78, y: 58, type: 'lead' },
  { name: 'Sydney', x: 88, y: 72, type: 'lead' },
  { name: 'Berlin', x: 51, y: 30, type: 'customer' },
  { name: 'São Paulo', x: 33, y: 68, type: 'lead' },
];

const ROUTES: [number, number][] = [
  [0, 2], [0, 3], [1, 8], [4, 5], [6, 5], [7, 11], [3, 4], [9, 7], [10, 4], [11, 5],
];

const COLORS = {
  company: '#00f0ff',
  customer: '#ff00d4',
  lead: '#a3ff00',
};

export default function CompanyMap() {
  const { workforcePaused, emergencyStop } = useOS();
  const [pulses, setPulses] = useState<{ route: number; progress: number }[]>([]);

  useEffect(() => {
    if (workforcePaused || emergencyStop) return;
    const interval = setInterval(() => {
      setPulses((prev) => [...prev.slice(-8), { route: Math.floor(Math.random() * ROUTES.length), progress: 0 }]);
    }, 800);
    return () => clearInterval(interval);
  }, [workforcePaused, emergencyStop]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setPulses((prev) => prev.map((p) => ({ ...p, progress: p.progress + 0.015 })).filter((p) => p.progress < 1));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-neon-cyan" />
          <span className="font-mono text-[10px] text-white/60 tracking-wider uppercase">Company Map</span>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-[9px]">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.company }} />Company</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.customer }} />Customer</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: COLORS.lead }} />Lead</span>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet">
          {Array.from({ length: 200 }).map((_, i) => {
            const x = (i * 37) % 100;
            const y = (i * 53) % 80;
            const inLand =
              (x > 10 && x < 30 && y > 25 && y < 55) ||
              (x > 25 && x < 40 && y > 55 && y < 75) ||
              (x > 44 && x < 58 && y > 20 && y < 55) ||
              (x > 55 && x < 75 && y > 20 && y < 55) ||
              (x > 75 && x < 90 && y > 35 && y < 75);
            if (!inLand) return null;
            return <circle key={i} cx={x} cy={y} r="0.4" fill="rgba(255,255,255,0.08)" />;
          })}

          {ROUTES.map(([a, b], i) => {
            const na = NODES[a];
            const nb = NODES[b];
            return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke="rgba(0,240,255,0.12)" strokeWidth="0.3" strokeDasharray="1 1" />;
          })}

          {pulses.map((p, i) => {
            const [a, b] = ROUTES[p.route];
            const na = NODES[a];
            const nb = NODES[b];
            const px = na.x + (nb.x - na.x) * p.progress;
            const py = na.y + (nb.y - na.y) * p.progress;
            return (
              <g key={i}>
                <circle cx={px} cy={py} r="1.5" fill="rgba(0,240,255,0.9)" />
                <circle cx={px} cy={py} r="3" fill="rgba(0,240,255,0.2)" />
              </g>
            );
          })}

          {NODES.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r="2" fill={COLORS[n.type]} />
              <circle cx={n.x} cy={n.y} r="4" fill="none" stroke={`${COLORS[n.type]}50`} strokeWidth="0.3" style={{ animation: `map-pulse 2s ease-in-out infinite ${i * 0.2}s` }} />
              <text x={n.x} y={n.y - 3} fill="rgba(255,255,255,0.4)" fontSize="2" textAnchor="middle" className="font-mono">{n.name}</text>
            </g>
          ))}
        </svg>
        <style>{`@keyframes map-pulse { 0%,100% { r: 4; opacity: 0.3; } 50% { r: 6; opacity: 0.6; } }`}</style>
        <div className="scanline opacity-50" />
      </div>
    </div>
  );
}
