import Section, { SectionHeading } from '../ui/Section';
import GlassCard from '../ui/GlassCard';
import { EMPLOYEES, type AIEmployee } from '../../data/employees';
import { useInView } from '../../hooks';
import HoloGlobe from '../visuals/HoloGlobe';
import { useEffect, useRef, useState } from 'react';

export default function Employees() {
  return (
    <Section id="employees" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="The Autonomous Team"
          title="Meet Your AI Employees"
          subtitle="Each AI worker operates autonomously — planning, executing, and optimizing without human intervention."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EMPLOYEES.map((emp, i) => (
            <EmployeeCard key={emp.id} employee={emp} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function EmployeeCard({ employee, index }: { employee: AIEmployee; index: number }) {
  const { ref, inView } = useInView(0.2);
  const Icon = employee.icon;

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <GlassCard tilt className="p-6 h-full group" float>
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-ember-500/20 blur-lg group-hover:bg-ember-500/30 transition-colors" />
              <div className="relative w-12 h-12 rounded-xl glass-ember flex items-center justify-center">
                <Icon className="w-6 h-6 text-ember-500" />
              </div>
            </div>
            <div>
              <div className="font-display text-lg font-bold text-white">{employee.name}</div>
              <div className="font-mono text-xs text-ember-500">{employee.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-ember-500 animate-pulse" />
            <span className="font-mono text-[10px] text-white/40">ONLINE</span>
          </div>
        </div>

        {/* visualization */}
        <div className="relative h-40 mb-6 rounded-xl overflow-hidden glass border border-white/5">
          <EmployeeViz id={employee.id} active={inView} />
        </div>

        {/* responsibilities */}
        <div className="space-y-2 mb-6">
          {employee.responsibilities.map((r) => (
            <div key={r} className="flex items-center gap-2 text-sm text-white/60">
              <span className="w-1 h-1 rounded-full bg-ember-500" />
              {r}
            </div>
          ))}
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
          {employee.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-lg font-bold text-ember-gradient">{s.value}</div>
              <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function EmployeeViz({ id, active }: { id: string; active: boolean }) {
  switch (id) {
    case 'strategist':
      return <StrategistViz active={active} />;
    case 'hunter':
      return <HunterViz active={active} />;
    case 'creator':
      return <CreatorViz active={active} />;
    case 'automator':
      return <AutomatorViz active={active} />;
    case 'guardian':
      return <GuardianViz active={active} />;
    case 'finance':
      return <FinanceViz active={active} />;
    default:
      return null;
  }
}

/** Strategist: rotating globe + revenue graph */
function StrategistViz({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 grid-bg-ember opacity-30" />
      <HoloGlobe size={120} className={active ? 'opacity-80' : 'opacity-40'} />
      {/* floating strategy cards */}
      <div className="absolute top-3 left-3 glass rounded px-2 py-1 animate-float-fast">
        <div className="font-mono text-[8px] text-ember-500">REV +24%</div>
      </div>
      <div className="absolute bottom-3 right-3 glass rounded px-2 py-1 animate-float-med">
        <div className="font-mono text-[8px] text-white/60">KPI 142</div>
      </div>
    </div>
  );
}

/** Hunter: world map with leads */
function HunterViz({ active }: { active: boolean }) {
  const [leads, setLeads] = useState<{ x: number; y: number; t: number }[]>([]);
  const raf = useRef(0);
  useEffect(() => {
    if (!active) return;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 800) {
        last = now;
        setLeads((prev) => [
          ...prev.slice(-8),
          { x: 10 + Math.random() * 80, y: 20 + Math.random() * 60, t: now },
        ]);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [active]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* dotted world map approximation */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
        {Array.from({ length: 80 }).map((_, i) => {
          const x = (i % 10) * 10 + 5;
          const y = Math.floor(i / 10) * 12 + 6;
          const visible = Math.random() > 0.3;
          return visible ? (
            <circle key={i} cx={x} cy={y} r="0.8" fill="rgba(255,106,0,0.3)" />
          ) : null;
        })}
      </svg>
      {/* leads */}
      {leads.map((l) => (
        <div
          key={l.t}
          className="absolute w-2 h-2 rounded-full bg-ember-500"
          style={{
            left: `${l.x}%`,
            top: `${l.y}%`,
            boxShadow: '0 0 8px rgba(255,106,0,0.8)',
            animation: 'ping-out 1s ease-out forwards',
          }}
        />
      ))}
      <style>{`@keyframes ping-out { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(3); opacity: 0; } }`}</style>
      {/* CRM card */}
      <div className="absolute bottom-2 left-2 glass rounded px-2 py-1">
        <div className="font-mono text-[8px] text-ember-500">DEAL CLOSED</div>
      </div>
    </div>
  );
}

/** Creator: social posts flying */
function CreatorViz({ active }: { active: boolean }) {
  const platforms = ['IG', 'in', 'X', 'YT', 'Blog'];
  return (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 grid-bg-ember opacity-20" />
      {platforms.map((p, i) => (
        <div
          key={p}
          className="absolute glass rounded-lg px-2 py-1.5 font-mono text-[9px] text-ember-500"
          style={{
            left: '10%',
            top: `${15 + i * 18}%`,
            animation: `fly-right 3s linear infinite`,
            animationDelay: `${i * 0.5}s`,
            opacity: active ? 1 : 0,
          }}
        >
          {p}
        </div>
      ))}
      <style>{`@keyframes fly-right { 0% { transform: translateX(-20px); opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateX(180px); opacity: 0; } }`}</style>
      {/* analytics bar */}
      <div className="absolute bottom-2 right-2 flex items-end gap-1 h-8">
        {[40, 60, 45, 80, 65, 90].map((h, i) => (
          <div
            key={i}
            className="w-1.5 bg-gradient-to-t from-ember-600 to-ember-400 rounded-t"
            style={{ height: `${h}%`, animation: `bar-pulse 2s ease-in-out infinite ${i * 0.1}s` }}
          />
        ))}
      </div>
      <style>{`@keyframes bar-pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}

/** Automator: workflow nodes connected */
function AutomatorViz({ active: _active }: { active: boolean }) {
  const nodes = [
    { x: 15, y: 30, label: 'n8n' },
    { x: 50, y: 20, label: 'API' },
    { x: 85, y: 35, label: 'Zap' },
    { x: 30, y: 70, label: 'OK' },
    { x: 70, y: 75, label: 'INV' },
  ];
  const links = [[0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4]];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {links.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="rgba(255,106,0,0.4)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            style={{ animation: 'dash-flow 1s linear infinite', animationDelay: `${i * 0.1}s` }}
          />
        ))}
        <style>{`@keyframes dash-flow { to { stroke-dashoffset: -4; } }`}</style>
      </svg>
      {nodes.map((n, i) => (
        <div
          key={i}
          className="absolute glass-ember rounded-md px-1.5 py-1 font-mono text-[8px] text-ember-500"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            transform: 'translate(-50%, -50%)',
            opacity: _active ? 1 : 0,
            transition: `opacity 0.5s ease ${i * 0.1}s`,
          }}
        >
          {n.label}
        </div>
      ))}
    </div>
  );
}

/** Guardian: sentiment graph + tickets */
function GuardianViz({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden p-3">
      <div className="absolute inset-0 grid-bg-ember opacity-20" />
      {/* sentiment line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
        <path
          d="M0,40 Q15,20 30,25 T60,15 T100,10"
          fill="none"
          stroke="rgba(255,106,0,0.6)"
          strokeWidth="1.5"
          strokeDasharray="100"
          strokeDashoffset={active ? '0' : '100'}
          style={{ transition: 'stroke-dashoffset 2s ease' }}
        />
        <path
          d="M0,50 Q20,45 40,40 T80,35 T100,30"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />
      </svg>
      {/* ticket cards */}
      <div className="absolute top-2 right-2 space-y-1">
        {['TICKET #4821', 'CHAT ACTIVE', 'CALL 00:34'].map((t, i) => (
          <div
            key={t}
            className="glass rounded px-2 py-0.5 font-mono text-[8px] text-white/60"
            style={{ opacity: active ? 1 : 0, transition: `opacity 0.5s ease ${0.3 + i * 0.2}s` }}
          >
            {t}
          </div>
        ))}
      </div>
      {/* happiness meter */}
      <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
        <div className="font-mono text-[8px] text-ember-500">HAPPINESS</div>
        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-ember-600 to-ember-400 rounded-full" style={{ width: active ? '97%' : '0%', transition: 'width 1.5s ease 0.5s' }} />
        </div>
      </div>
    </div>
  );
}

/** Finance: charts + currency */
function FinanceViz({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden p-3">
      <div className="absolute inset-0 grid-bg-ember opacity-20" />
      {/* bar chart */}
      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-1 h-20">
        {[30, 45, 35, 60, 50, 75, 65, 90].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-ember-600 to-ember-400 rounded-t-sm"
            style={{
              height: active ? `${h}%` : '0%',
              transition: `height 0.8s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
              boxShadow: '0 0 4px rgba(255,106,0,0.3)',
            }}
          />
        ))}
      </div>
      {/* floating currency */}
      <div className="absolute top-2 left-3 font-mono text-xs text-ember-500 animate-float-fast">₹</div>
      <div className="absolute top-4 right-4 font-mono text-sm text-ember-gradient animate-float-med">₹12.4Cr</div>
      <div className="absolute top-8 left-8 font-mono text-[10px] text-white/40 animate-float-slow">+18% MoM</div>
    </div>
  );
}
