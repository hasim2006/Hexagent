import { useEffect, useState, useRef } from 'react';
import { NEON_COLORS, type AIEmployee } from '../../data/employees';
import AIThinking from './AIThinking';
import { useOS, type WorkspaceId } from '../../os/store';
import { Cpu, MemoryStick, ListChecks, Activity, ChevronRight, Zap } from 'lucide-react';

interface AICardProps {
  employee: AIEmployee;
  index: number;
}

export interface PodStats {
  cpu: number;
  memory: number;
  tasks: number;
  queue: number;
}

const LOG_TEMPLATES: Record<string, string[]> = {
  strategist: ['Analyzing market trends...', 'KPI dashboard synced', 'Revenue forecast updated', 'Risk assessment complete', 'Strategy iteration #42'],
  hunter: ['Scanning prospect database...', 'Lead score calculated: 87/100', 'Outreach sequence triggered', 'Pipeline updated +₹4.18L', 'Meeting scheduled'],
  creator: ['Generating content brief...', 'Instagram carousel drafted', 'Hashtag analysis complete', 'LinkedIn article optimized', 'Content calendar updated'],
  automator: ['Executing workflow #327...', 'API sync completed', 'Invoice approved automatically', 'Database backup verified', 'n8n pipeline triggered'],
  guardian: ['Processing support ticket...', 'Sentiment analyzed: positive', 'Auto-reply generated', 'Resolution suggested', 'Satisfaction score: 4.7/5'],
  finance: ['Processing invoices...', 'Cashflow forecast updated', 'Tax estimation recalculated', 'Profit margin analyzed', 'Monthly report generated'],
};

export default function AIPod({ employee, index }: AICardProps) {
  const { openWorkspace, workforcePaused, emergencyStop } = useOS();
  const Icon = employee.icon;
  const nc = NEON_COLORS[employee.neon];
  const [stats, setStats] = useState<PodStats>({ cpu: 20 + index * 5, memory: 35 + index * 3, tasks: index * 12, queue: index * 2 });
  const [logs, setLogs] = useState<string[]>([]);
  const [hovered, setHovered] = useState(false);
  const logIndex = useRef(0);

  const isWorking = !workforcePaused && !emergencyStop;

  useEffect(() => {
    if (!isWorking) return;
    const interval = setInterval(() => {
      setStats((prev) => ({
        cpu: Math.max(8, Math.min(92, prev.cpu + (Math.random() - 0.5) * 16)),
        memory: Math.max(20, Math.min(82, prev.memory + (Math.random() - 0.5) * 8)),
        tasks: prev.tasks + Math.floor(Math.random() * 4),
        queue: Math.max(0, Math.min(18, prev.queue + Math.floor(Math.random() * 5) - 2)),
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, [isWorking]);

  useEffect(() => {
    if (!isWorking) return;
    const templates = LOG_TEMPLATES[employee.id] || [];
    const interval = setInterval(() => {
      const log = templates[logIndex.current % templates.length];
      logIndex.current++;
      setLogs((prev) => [...prev.slice(-3), log]);
    }, 2000 + index * 300);
    return () => clearInterval(interval);
  }, [employee.id, index, isWorking]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => openWorkspace(employee.id as WorkspaceId)}
      className="relative cursor-pointer group h-full"
      style={{ animation: `card-float 6s ease-in-out infinite ${index * 0.4}s` }}
    >
      <style>{`@keyframes card-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }`}</style>

      {/* hover glow */}
      <div
        className="absolute -inset-0.5 rounded-2xl blur-xl transition-opacity duration-400 pointer-events-none"
        style={{ background: `rgba(${nc.rgb}, ${hovered ? 0.18 : 0.06})`, opacity: hovered ? 1 : 0.4 }}
      />

      {/* card */}
      <div
        className="relative h-full rounded-2xl p-4 transition-all duration-300 flex flex-col"
        style={{
          background: 'linear-gradient(145deg, rgba(4, 10, 20, 0.96) 0%, rgba(7, 16, 31, 0.9) 100%)',
          borderColor: hovered ? `rgba(${nc.rgb}, 0.35)` : 'rgba(255,255,255,0.09)',
          borderWidth: '1px',
          boxShadow: hovered
            ? `0 14px 36px rgba(${nc.rgb},0.16), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(${nc.rgb},0.12)`
            : '0 10px 28px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05)',
          transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        {/* header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="relative flex-shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, rgba(${nc.rgb},0.22), rgba(${nc.rgb},0.07))`, border: `1px solid rgba(${nc.rgb},0.28)` }}
            >
              <Icon className="w-5 h-5" style={{ color: nc.hex }} />
            </div>
            <div
              className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-ink-950 ${isWorking ? 'animate-pulse' : ''}`}
              style={{ background: emergencyStop ? '#ef4444' : workforcePaused ? '#eab308' : nc.hex }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-[13px] font-bold text-white truncate">{employee.name}</div>
            <div className="font-mono text-[9px] truncate" style={{ color: nc.hex }}>{employee.role}</div>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-wider flex-shrink-0"
            style={{
              background: emergencyStop ? 'rgba(239,68,68,0.1)' : workforcePaused ? 'rgba(234,179,8,0.1)' : `rgba(${nc.rgb},0.1)`,
              color: emergencyStop ? '#ef4444' : workforcePaused ? '#eab308' : nc.hex,
            }}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isWorking ? 'animate-pulse' : ''}`} style={{ background: 'currentColor' }} />
            {emergencyStop ? 'Halted' : workforcePaused ? 'Idle' : 'Working'}
          </div>
        </div>

        {/* thinking visualization */}
        <div className="relative h-14 rounded-lg overflow-hidden mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}>
          <AIThinking size={90} active={isWorking} color={nc.hex} />
          <div className="absolute bottom-1 left-2 font-mono text-[8px] text-white/30">
            {emergencyStop ? 'HALTED' : workforcePaused ? 'PAUSED' : 'PROCESSING...'}
          </div>
        </div>

        {/* live stats */}
        <div className="space-y-2 mb-3">
          <StatBar icon={Cpu} label="CPU" value={stats.cpu} color={nc.hex} rgb={nc.rgb} />
          <StatBar icon={MemoryStick} label="MEM" value={stats.memory} color={nc.hex} rgb={nc.rgb} />
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-[9px] font-mono">
            <span className="flex items-center gap-1 text-white/60">
              <ListChecks className="w-2.5 h-2.5" />
              <span className="text-white font-semibold tabular-nums">{stats.tasks}</span>
              <span className="text-white/70">tasks</span>
            </span>
            <span className="flex items-center gap-1 text-white/60">
              <Activity className="w-2.5 h-2.5" />
              <span className="text-white font-semibold tabular-nums">{stats.queue}</span>
              <span className="text-white/70">queue</span>
            </span>
          </div>
        </div>

        {/* live logs */}
        <div className="mt-auto pt-2.5 border-t border-white/5 space-y-0.5 h-10 overflow-hidden">
          {logs.slice(-2).map((log, i) => (
            <div key={log + i} className="font-mono text-[8px] text-white/40 truncate" style={{ animation: 'log-in 0.3s ease-out' }}>
              <span style={{ color: nc.hex }}>›</span> {log}
            </div>
          ))}
        </div>

        {/* open workspace button */}
        <button
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all duration-300"
          style={{
            background: hovered ? `linear-gradient(135deg, rgba(${nc.rgb},0.2), rgba(${nc.rgb},0.05))` : 'rgba(255,255,255,0.035)',
            border: `1px solid ${hovered ? `rgba(${nc.rgb},0.3)` : 'rgba(255,255,255,0.07)'}`,
            color: hovered ? nc.hex : 'rgba(255,255,255,0.56)',
          }}
        >
          <Zap className="w-3 h-3" />
          Open Workspace
          <ChevronRight className={`w-3 h-3 transition-transform ${hovered ? 'translate-x-0.5' : ''}`} />
        </button>

        <style>{`@keyframes log-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </div>
  );
}

function StatBar({ icon: Icon, label, value, color, rgb }: { icon: typeof Cpu; label: string; value: number; color: string; rgb: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
      <Icon className="w-2.5 h-2.5 text-white/70 flex-shrink-0" />
      <span className="font-mono text-[8px] font-semibold text-white/80 w-6">{label}</span>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: `linear-gradient(to right, rgba(${rgb},0.6), ${color})` }}
        />
      </div>
      <span className="font-mono text-[8px] font-semibold text-white w-7 text-right tabular-nums">{Math.floor(value)}%</span>
    </div>
  );
}
