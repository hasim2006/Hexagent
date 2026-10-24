import { useOS } from '../../os/store';
import { EMPLOYEES, NEON_COLORS } from '../../data/employees';
import AIPod from '../workforce/AIPod';
import MasterCommand from './MasterCommand';
import ParticleField from '../visuals/ParticleField';
import ActivityStream from './ActivityStream';
import CompanyMap from '../visuals/CompanyMap';
import LiveGraph from '../visuals/LiveGraph';
import LiveTerminal from './LiveTerminal';
import CEOBriefing from './CEOBriefing';
import { Cpu, DollarSign, Zap, Users, Activity, ShieldCheck, Gauge, Server } from 'lucide-react';
import { useEffect, useState } from 'react';
import VoiceToggle from './VoiceToggle';
import { voiceWelcomeHasim } from '../../os/voice';

const TERMINAL_LINES = [
  'Initializing AI workforce kernel...',
  'Loading neural models for 6 agents...',
  'STRATEGIST: model loaded ✓',
  'HUNTER: model loaded ✓',
  'CREATOR: model loaded ✓',
  'AUTOMATOR: model loaded ✓',
  'GUARDIAN: model loaded ✓',
  'FINANCE: model loaded ✓',
  'Connecting to intelligence network...',
  'API gateway online — 7 services connected',
  'Database sync verified — 0 conflicts',
  'Security layer active — 100% compliant',
  'Workforce deployment: SUCCESS',
  'All 6 AI agents now operational',
  'Auto-scaling enabled — monitoring load...',
  'System health: ALL NOMINAL',
];

export default function Dashboard() {
  const { workforcePaused, emergencyStop } = useOS();
  const [time, setTime] = useState(new Date());
  const [stats, setStats] = useState({
    revenue: 28450,
    tasks: 1280,
    automations: 327,
    activeAgents: 6,
    cpu: 42,
    memory: 58,
    health: 99.2,
  });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Welcome voice announcement for Hasim upon entering
    const timer = setTimeout(() => {
      voiceWelcomeHasim();
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (workforcePaused || emergencyStop) return;
    const interval = setInterval(() => {
      setStats((prev) => ({
        revenue: prev.revenue,
        tasks: prev.tasks + Math.floor(Math.random() * 4),
        automations: prev.automations + (Math.random() > 0.7 ? 1 : 0),
        activeAgents: emergencyStop ? 0 : 6,
        cpu: Math.max(15, Math.min(85, prev.cpu + (Math.random() - 0.5) * 8)),
        memory: Math.max(30, Math.min(80, prev.memory + (Math.random() - 0.5) * 4)),
        health: Math.max(98.5, Math.min(99.9, prev.health + (Math.random() - 0.5) * 0.05)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [workforcePaused, emergencyStop]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden dashboard-shell">
      {/* background */}
      <div className="fixed inset-0 pointer-events-none">
        <ParticleField density={20} color="#00f0ff" speed={0.1} />
      </div>
      <div className="fixed inset-0 grid-bg-cyan opacity-[0.12]" />

      {/* top bar */}
      <div
        className="sticky top-0 z-30 mx-2 sm:mx-3 mt-2 sm:mt-3 flex items-center justify-between rounded-2xl border border-white/10 px-3 sm:px-5 py-2.5 sm:py-3 backdrop-blur-xl panel-3d gap-2"
        style={{
          background: 'linear-gradient(135deg, rgba(2, 8, 20, 0.98) 0%, rgba(4, 13, 26, 0.95) 45%, rgba(1, 6, 16, 0.98) 100%)',
          boxShadow: '0 18px 60px rgba(0,0,0,0.42), 0 0 0 1px rgba(0,240,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg glass-neon-cyan flex items-center justify-center">
            <Cpu className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-neon-cyan" />
          </div>
          <div>
            <div className="font-display font-bold text-xs sm:text-[13px] text-white tracking-tight">made with Hasim</div>
            <div className="font-mono text-[8px] sm:text-[9px] text-neon-cyan tracking-wider">COMMAND CENTER</div>
          </div>
        </div>
        <div className="hidden md:block">
          <MasterCommand />
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <VoiceToggle compact />
          <div className="font-mono text-[11px] text-white/40 hidden lg:block tabular-nums">
            {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${emergencyStop ? 'bg-red-500' : workforcePaused ? 'bg-yellow-500' : 'bg-neon-cyan animate-pulse'}`} />
            <span className="font-mono text-[10px] text-white/50 hidden sm:block">
              {emergencyStop ? 'EMERGENCY' : workforcePaused ? 'PAUSED' : 'ONLINE'}
            </span>
          </div>
        </div>
      </div>

      {/* mobile master command */}
      <div className="md:hidden px-4 py-2.5 border-b border-white/5 bg-ink-950/50 backdrop-blur-xl sticky top-[57px] z-20">
        <MasterCommand />
      </div>

      {/* main scrollable content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* ── System Overview Card ── */}
        <div className="relative panel-3d glass-strong rounded-2xl p-5 overflow-hidden">
          <div className="absolute inset-0 grid-bg-cyan opacity-[0.08]" />
          <div className="relative flex flex-col lg:flex-row gap-5">
            {/* left: identity */}
            <div className="flex items-center gap-4 lg:w-[280px] flex-shrink-0">
              <div className="relative w-14 h-14 rounded-2xl glass-neon-cyan flex items-center justify-center flex-shrink-0">
                <Cpu className="w-7 h-7 text-neon-cyan" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-ink-950 flex items-center justify-center">
                  <span className={`w-2.5 h-2.5 rounded-full ${emergencyStop ? 'bg-red-500' : workforcePaused ? 'bg-yellow-500' : 'bg-neon-cyan animate-pulse'}`} />
                </div>
              </div>
              <div>
                <div className="font-display text-lg font-bold text-white tracking-tight">made with Hasim</div>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-3 h-3 text-green-400" />
                  <span className="font-mono text-[10px] text-white/50">System Health: {stats.health.toFixed(1)}%</span>
                </div>
                <div className="font-mono text-[9px] text-white/30 mt-0.5">
                  {emergencyStop ? 'ALL OPERATIONS HALTED' : workforcePaused ? 'WORKFORCE PAUSED' : 'ALL SYSTEMS OPERATIONAL'}
                </div>
              </div>
            </div>

            {/* right: live metrics grid */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <OverviewStat icon={DollarSign} label="Revenue" value={`₹${stats.revenue.toLocaleString('en-IN')}`} sub="today" color="#00ff88" />
              <OverviewStat icon={Activity} label="Tasks" value={stats.tasks.toLocaleString('en-IN')} sub="completed" color="#00f0ff" />
              <OverviewStat icon={Zap} label="Automations" value={stats.automations.toString()} sub="running" color="#a3ff00" />
              <OverviewStat icon={Users} label="Agents" value={`${emergencyStop ? 0 : workforcePaused ? 0 : stats.activeAgents}`} sub="connected" color="#9d4eff" />
              <OverviewStat icon={Gauge} label="CPU" value={`${Math.floor(stats.cpu)}%`} sub="usage" color="#ff00d4" live={stats.cpu} />
              <OverviewStat icon={Server} label="Memory" value={`${Math.floor(stats.memory)}%`} sub="usage" color="#ffb800" live={stats.memory} />
            </div>
          </div>
        </div>

        {/* ── AI Employee Cards (3×2 grid) ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-neon-cyan" />
            <h2 className="font-display text-sm font-bold text-white tracking-tight">AI Workforce</h2>
            <span className="font-mono text-[10px] text-white/30">6 agents active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EMPLOYEES.map((emp, i) => (
              <AIPod key={emp.id} employee={emp} index={i} />
            ))}
          </div>
        </div>

        {/* ── Live Activity Feed ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-neon-cyan" />
            <h2 className="font-display text-sm font-bold text-white tracking-tight">Live Activity</h2>
            <span className="font-mono text-[10px] text-white/30">real-time</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
            <div className="panel-3d glass-strong rounded-2xl overflow-hidden">
              <ActivityStream />
            </div>
            <div className="panel-3d glass-strong rounded-2xl overflow-hidden min-h-[300px]">
              <CompanyMap />
            </div>
          </div>
        </div>

        {/* ── Revenue Analytics ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-green-400" />
            <h2 className="font-display text-sm font-bold text-white tracking-tight">Revenue Analytics</h2>
            <span className="font-mono text-[10px] text-white/30">live</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-strong rounded-2xl p-4">
              <LiveGraph label="REVENUE FLOW" unit="₹" height={80} color="#00ff88" baseValue={60} volatility={10} updateInterval={700} />
            </div>
            <div className="glass-strong rounded-2xl p-4">
              <LiveGraph label="TASK THROUGHPUT" unit="/s" height={80} color="#00f0ff" baseValue={45} volatility={16} updateInterval={600} />
            </div>
            <div className="glass-strong rounded-2xl p-4">
              <LiveGraph label="NETWORK LATENCY" unit="ms" height={80} color="#ff00d4" baseValue={30} volatility={6} updateInterval={800} />
            </div>
          </div>
        </div>

        {/* ── Automation Timeline ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-neon-lime" />
            <h2 className="font-display text-sm font-bold text-white tracking-tight">Automation Timeline</h2>
            <span className="font-mono text-[10px] text-white/30">system log</span>
          </div>
          <div className="glass-strong rounded-2xl p-4">
            <LiveTerminal lines={TERMINAL_LINES} title="made with Hasim — SYSTEM TERMINAL" height="h-40" />
          </div>
        </div>

        {/* ── Recent Notifications ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-neon-magenta" />
            <h2 className="font-display text-sm font-bold text-white tracking-tight">Recent Notifications</h2>
          </div>
          <NotificationsPanel />
        </div>

        {/* ── Audio Player / CEO Briefing ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-neon-violet" />
            <h2 className="font-display text-sm font-bold text-white tracking-tight">CEO Audio Briefing</h2>
          </div>
          <CEOBriefing />
        </div>
      </div>
    </div>
  );
}

function OverviewStat({ icon: Icon, label, value, sub, color, live }: { icon: typeof Cpu; label: string; value: string; sub: string; color: string; live?: number }) {
  return (
    <div className="panel-3d glass rounded-xl p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3 h-3" style={{ color }} />
        <span className="font-mono text-[8px] text-white/40 uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-display text-[14px] font-bold text-white tabular-nums">{value}</div>
      {live !== undefined ? (
        <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${live}%`, background: color }} />
        </div>
      ) : (
        <div className="font-mono text-[8px]" style={{ color }}>{sub}</div>
      )}
    </div>
  );
}

function NotificationsPanel() {
  const notifications = [
    { agent: 'HUNTER', text: 'New lead: Vertex Labs — score 95/100', time: '2m ago', color: 'rose' },
    { agent: 'FINANCE', text: 'Invoice #INV-0847 processed — ₹4,200', time: '5m ago', color: 'amber' },
    { agent: 'CREATOR', text: 'Instagram carousel published successfully', time: '8m ago', color: 'magenta' },
    { agent: 'GUARDIAN', text: 'Ticket #4821 resolved — satisfaction 5/5', time: '12m ago', color: 'green' },
    { agent: 'AUTOMATOR', text: 'Workflow #327 executed — all nodes passed', time: '15m ago', color: 'lime' },
    { agent: 'STRATEGIST', text: 'Revenue forecast updated: +18% this week', time: '18m ago', color: 'cyan' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {notifications.map((n, i) => {
        const nc = NEON_COLORS[n.color as keyof typeof NEON_COLORS];
        return (
          <div
            key={i}
            className="panel-3d glass rounded-xl px-3.5 py-3 flex items-center gap-3 transition-all hover:glass-strong"
            style={{ animation: `notif-in 0.4s ease ${i * 0.08}s both` }}
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${nc.rgb},0.12)`, border: `1px solid rgba(${nc.rgb},0.2)` }}>
              <span className="font-mono text-[8px] font-bold" style={{ color: nc.hex }}>{n.agent[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-white/70 truncate">{n.text}</div>
              <div className="font-mono text-[9px] mt-0.5" style={{ color: nc.hex }}>{n.agent}</div>
            </div>
            <span className="font-mono text-[9px] text-white/25 flex-shrink-0">{n.time}</span>
          </div>
        );
      })}
      <style>{`@keyframes notif-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
