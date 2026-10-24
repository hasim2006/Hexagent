import { useState, useEffect } from 'react';
import { useOS } from '../../os/store';
import { Rocket, Pause, Play, Octagon, HeartPulse, FileText, X } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import {
  voiceDeployAll,
  voicePause,
  voiceResume,
  voiceEmergencyStop,
  voiceEmergencyReset,
  voiceReport,
  voiceHealth,
} from '../../os/voice';

export default function MasterCommand() {
  const { workforcePaused, emergencyStop, pauseWorkforce, resumeWorkforce, emergencyStopAll, resetEmergency, addActivity } = useOS();
  const [showReport, setShowReport] = useState(false);
  const [showHealth, setShowHealth] = useState(false);
  const [deploying, setDeploying] = useState(false);

  const handleDeploy = () => {
    setDeploying(true);
    addActivity('SYSTEM', 'DEPLOY ALL AI', 'All six AI agents activated simultaneously');
    voiceDeployAll();
    setTimeout(() => setDeploying(false), 3000);
  };

  const handlePause = () => {
    pauseWorkforce();
    voicePause();
  };

  const handleResume = () => {
    resumeWorkforce();
    voiceResume();
  };

  const handleEmergency = () => {
    emergencyStopAll();
    voiceEmergencyStop();
  };

  const handleReset = () => {
    resetEmergency();
    voiceEmergencyReset();
  };

  const handleReport = () => {
    setShowReport(true);
    addActivity('SYSTEM', 'generated report', 'Company-wide performance report compiled');
    voiceReport();
  };

  const handleHealth = () => {
    setShowHealth(true);
    voiceHealth();
  };

  return (
    <>
      <div className="relative glass-strong rounded-2xl px-3 py-2.5 md:px-6 md:py-4">
        <div className="absolute -inset-1 rounded-2xl blur-xl -z-10" style={{ background: 'rgba(0,240,255,0.08)' }} />

        <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          <div className="flex items-center gap-2 pr-2.5 md:pr-4 border-r border-white/10 flex-shrink-0">
            <span className={`w-2.5 h-2.5 rounded-full ${emergencyStop ? 'bg-red-500' : workforcePaused ? 'bg-yellow-500' : 'bg-neon-cyan animate-pulse'}`} />
            <span className="font-mono text-[10px] md:text-xs text-white/60 hidden sm:block">
              {emergencyStop ? 'EMERGENCY' : workforcePaused ? 'PAUSED' : 'ACTIVE'}
            </span>
          </div>

          <CmdButton icon={Rocket} label="Deploy All AI" onClick={handleDeploy} variant="primary" active={deploying} />
          {workforcePaused ? (
            <CmdButton icon={Play} label="Resume" onClick={handleResume} />
          ) : (
            <CmdButton icon={Pause} label="Pause" onClick={handlePause} disabled={emergencyStop} />
          )}
          {emergencyStop ? (
            <CmdButton icon={Play} label="Reset" onClick={handleReset} variant="danger" />
          ) : (
            <CmdButton icon={Octagon} label="Emergency Stop" onClick={handleEmergency} variant="danger" />
          )}
          <CmdButton icon={HeartPulse} label="System Health" onClick={handleHealth} />
          <CmdButton icon={FileText} label="Company Report" onClick={handleReport} />
        </div>

        {deploying && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-neon-cyan/10 animate-pulse" />
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" style={{ animation: 'scan-down 1.5s linear infinite' }} />
            <style>{`@keyframes scan-down { from { top: 0; } to { top: 100%; } }`}</style>
          </div>
        )}
      </div>

      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
      {showHealth && <HealthModal onClose={() => setShowHealth(false)} />}
    </>
  );
}

function CmdButton({
  icon: Icon, label, onClick, variant = 'ghost', active = false, disabled = false,
}: {
  icon: typeof Rocket; label: string; onClick: () => void; variant?: 'ghost' | 'primary' | 'danger'; active?: boolean; disabled?: boolean;
}) {
  const base = 'flex items-center gap-1.5 px-2.5 md:px-3.5 py-1.5 md:py-2 rounded-lg font-mono text-[10px] md:text-xs font-medium transition-all duration-200 whitespace-nowrap';
  const variants = {
    ghost: 'glass text-white/70 hover:text-white hover:glass-strong',
    primary: 'text-white glow-cyan',
    danger: 'glass text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/20',
  };
  const primaryStyle = variant === 'primary' ? { background: 'linear-gradient(to right, #00f0ff, #0080ff)' } : {};
  return (
    <button onClick={onClick} disabled={disabled} style={primaryStyle} className={`${base} ${variants[variant]} ${active ? 'scale-95' : ''} ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}>
      <Icon className={`w-3.5 h-3.5 ${active ? 'animate-pulse' : ''}`} />
      <span className="hidden md:block">{label}</span>
    </button>
  );
}

function ReportModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState('');
  const fullText = `made with Hasim — COMPANY REPORT
══════════════════════════════════

MONTHLY REVENUE:     ₹3,42,800
TASKS COMPLETED:     1,280+
AUTOMATION ACCURACY: 99.2%
AI EMPLOYEES ACTIVE: 6
AUTOMATIONS RUNNING: 327

DEPARTMENT BREAKDOWN:
• STRATEGIST — Revenue forecast +18%, 42 KPIs tracked
• HUNTER — 23 deals closed, ₹4.18L pipeline
• CREATOR — 42 posts/week, 48K reach, 8.4% engagement
• AUTOMATOR — 327 workflows, 38 human hours saved/week
• GUARDIAN — 94% resolution rate, 0.8s avg response
• FINANCE — 92% forecast accuracy, 100% compliance

SYSTEM HEALTH: OPTIMAL
UPTIME: 99.99%
ALL SYSTEMS NOMINAL.`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i += 3;
      if (i > fullText.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-ink-950/80 backdrop-blur-md" onClick={onClose}>
      <GlassCard className="max-w-2xl w-full p-6 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-neon-cyan" />
            <h3 className="font-display text-lg font-bold text-white">Company Report</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <pre className="font-mono text-xs text-white/70 whitespace-pre-wrap leading-relaxed">{text}<span className="text-neon-cyan animate-pulse">▊</span></pre>
      </GlassCard>
    </div>
  );
}

function HealthModal({ onClose }: { onClose: () => void }) {
  const systems = [
    { name: 'AI Core Engine', status: 'OPTIMAL', value: 99.9, color: '#00f0ff' },
    { name: 'Neural Network', status: 'OPTIMAL', value: 98.7, color: '#ff00d4' },
    { name: 'Memory Banks', status: 'OPTIMAL', value: 94.2, color: '#a3ff00' },
    { name: 'API Gateway', status: 'OPTIMAL', value: 99.8, color: '#9d4eff' },
    { name: 'Database Sync', status: 'OPTIMAL', value: 97.5, color: '#00ff88' },
    { name: 'Security Layer', status: 'OPTIMAL', value: 100, color: '#ffb800' },
  ];
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-ink-950/80 backdrop-blur-md" onClick={onClose}>
      <GlassCard className="max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-neon-cyan" />
            <h3 className="font-display text-lg font-bold text-white">System Health</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          {systems.map((s, i) => (
            <div key={s.name} className="flex items-center gap-3" style={{ animation: `fade-in 0.3s ease ${i * 0.1}s both` }}>
              <span className="font-mono text-xs text-white/60 w-32">{s.name}</span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.value}%`, background: `linear-gradient(to right, ${s.color}80, ${s.color})` }} />
              </div>
              <span className="font-mono text-xs w-12 text-right" style={{ color: s.color }}>{s.value}%</span>
              <span className="font-mono text-[10px] text-green-400 w-16">{s.status}</span>
            </div>
          ))}
        </div>
        <style>{`@keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </GlassCard>
    </div>
  );
}
