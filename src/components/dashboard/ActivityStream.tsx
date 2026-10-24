import { useOS } from '../../os/store';
import { NEON_COLORS } from '../../data/employees';
import { CheckCircle2 } from 'lucide-react';

const AGENT_NEON: Record<string, string> = {
  STRATEGIST: 'cyan',
  HUNTER: 'rose',
  CREATOR: 'magenta',
  AUTOMATOR: 'lime',
  GUARDIAN: 'green',
  FINANCE: 'amber',
  SYSTEM: 'violet',
};

export default function ActivityStream() {
  const { activities } = useOS();

  return (
    <div className="flex flex-col" style={{ maxHeight: '52vh' }}>
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-1.5">
        {activities.map((item) => {
          const neonKey = AGENT_NEON[item.agent] || 'cyan';
          const nc = NEON_COLORS[neonKey as keyof typeof NEON_COLORS];
          return (
            <div
              key={item.id}
              className="glass rounded-xl px-3 py-2.5 flex items-start gap-2.5"
              style={{ animation: 'activity-in 0.35s cubic-bezier(0.16,1,0.3,1)' }}
            >
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `rgba(${nc.rgb},0.12)` }}>
                <CheckCircle2 className="w-3 h-3" style={{ color: nc.hex }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="font-mono text-[10px] font-bold" style={{ color: nc.hex }}>{item.agent}</span>
                  <span className="text-[11px] text-white/50">{item.action}</span>
                </div>
                <div className="text-[10px] text-white/35 mt-0.5 truncate">{item.detail}</div>
              </div>
              <span className="font-mono text-[9px] text-white/20 flex-shrink-0 mt-0.5">{item.time}</span>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes activity-in { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}
