import { type ReactNode, useEffect, useState } from 'react';
import { useOS } from '../../os/store';
import { EMPLOYEES, NEON_COLORS } from '../../data/employees';
import { ArrowLeft, X, Cpu, MemoryStick, Activity } from 'lucide-react';
import AIThinking from '../workforce/AIThinking';
import Waveform from '../visuals/Waveform';
import LiveTerminal from '../dashboard/LiveTerminal';
import VoiceToggle from '../dashboard/VoiceToggle';

interface WorkspaceShellProps {
  employeeId: string;
  children: ReactNode;
  terminalLines?: string[];
}

export default function WorkspaceShell({ employeeId, children, terminalLines }: WorkspaceShellProps) {
  const { closeWorkspace, workforcePaused, emergencyStop } = useOS();
  const employee = EMPLOYEES.find((e) => e.id === employeeId)!;
  const nc = NEON_COLORS[employee.neon];
  const Icon = employee.icon;
  const [entering, setEntering] = useState(true);
  const [stats, setStats] = useState({ cpu: 45, memory: 62, tasks: 0 });

  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (workforcePaused || emergencyStop) return;
    const interval = setInterval(() => {
      setStats((prev) => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 15)),
        memory: Math.max(30, Math.min(85, prev.memory + (Math.random() - 0.5) * 8)),
        tasks: prev.tasks + Math.floor(Math.random() * 5),
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, [workforcePaused, emergencyStop]);

  const defaultTerminal = [
    `${employee.name} AI initialized...`,
    'Loading neural models...',
    'Connecting to intelligence network...',
    'Model loaded ✓',
    'Ready for autonomous operation',
  ];

  return (
    <div className={`fixed inset-0 z-[100] bg-ink-950 overflow-hidden transition-all duration-500 ${entering ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
      <div className={`absolute inset-0 ${nc.grid} opacity-15`} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl" style={{ background: `rgba(${nc.rgb},0.08)` }} />
      </div>

      {/* top bar */}
      <div className="relative z-20 flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-white/5 bg-ink-950/60 backdrop-blur-xl gap-2">
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={closeWorkspace}
            className="flex items-center gap-1.5 sm:gap-2 glass rounded-lg px-2.5 sm:px-3 py-1.5 text-white/60 hover:text-white hover:glass-strong transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-mono text-xs hidden sm:inline">Back to Command</span>
            <span className="font-mono text-xs sm:hidden">Back</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-2 rounded-full blur-lg" style={{ background: `rgba(${nc.rgb},0.2)` }} />
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, rgba(${nc.rgb},0.12), rgba(${nc.rgb},0.02))`, border: `1px solid rgba(${nc.rgb},0.25)` }}>
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: nc.hex }} />
            </div>
          </div>
          <div className="truncate">
            <div className="font-display font-bold text-xs sm:text-sm text-white truncate">{employee.name}</div>
            <div className="font-mono text-[9px] sm:text-[10px] truncate" style={{ color: nc.hex }}>{employee.role}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <VoiceToggle compact />
          <div className="hidden lg:flex items-center gap-3">
            <MiniStat icon={Cpu} label="CPU" value={`${Math.floor(stats.cpu)}%`} color={nc.hex} />
            <MiniStat icon={MemoryStick} label="MEM" value={`${Math.floor(stats.memory)}%`} color={nc.hex} />
            <MiniStat icon={Activity} label="TASKS" value={stats.tasks.toString()} color={nc.hex} />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className={`w-2 h-2 rounded-full ${emergencyStop ? 'bg-red-500' : workforcePaused ? 'bg-yellow-500' : 'animate-pulse'}`} style={(!emergencyStop && !workforcePaused) ? { background: nc.hex } : {}} />
            <span className="font-mono text-[9px] sm:text-[10px] text-white/50 hidden xs:inline">
              {emergencyStop ? 'HALTED' : workforcePaused ? 'PAUSED' : 'ACTIVE'}
            </span>
            <button onClick={closeWorkspace} className="ml-1 text-white/40 hover:text-white p-1">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* AI thinking bar */}
      <div className="relative z-10 flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2 border-b border-white/5 bg-ink-950/40">
        <div className="flex items-center gap-2 flex-shrink-0">
          <AIThinking size={24} active={!workforcePaused && !emergencyStop} color={nc.hex} />
          <span className="font-mono text-[9px] sm:text-[10px] text-white/40 hidden xs:inline">NEURAL ACTIVITY</span>
        </div>
        <div className="flex-1 h-6 sm:h-8 max-w-xs">
          <Waveform bars={30} active={!workforcePaused && !emergencyStop} color={nc.hex} />
        </div>
        <span className="font-mono text-[10px] hidden md:block" style={{ color: nc.hex }}>
          {emergencyStop ? 'STOPPED' : workforcePaused ? 'IDLE' : 'PROCESSING...'}
        </span>
      </div>

      {/* workspace content */}
      <div className="relative z-10 h-[calc(100dvh-130px)] overflow-y-auto no-scrollbar pb-10">
        <div className="max-w-7xl mx-auto p-3 sm:p-5">
          {children}
        </div>
        <div className="max-w-7xl mx-auto px-3 sm:px-5 pb-5">
          <LiveTerminal lines={terminalLines || defaultTerminal} title={`${employee.name} — EXECUTION LOG`} height="h-28" />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon: Icon, label, value, color }: { icon: typeof Cpu; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5 glass rounded-lg px-2.5 py-1">
      <Icon className="w-3 h-3" style={{ color }} />
      <span className="font-mono text-[9px] text-white/40">{label}</span>
      <span className="font-mono text-[10px] text-white/70 font-bold">{value}</span>
    </div>
  );
}
