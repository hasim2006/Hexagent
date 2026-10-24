import { useState, useEffect } from 'react';
import WorkspaceShell from './WorkspaceShell';
import GlassCard from '../ui/GlassCard';
import LiveGraph from '../visuals/LiveGraph';
import { useOS } from '../../os/store';
import { NEON_COLORS } from '../../data/employees';
import { Target, AlertTriangle, Brain, Sparkles, TrendingUp, Shield } from 'lucide-react';

const C = NEON_COLORS.cyan;
const TERMINAL_LINES = [
  'STRATEGIST AI booting...',
  'Loading market analysis models...',
  'Connecting to data sources: 14 APIs...',
  'KPI dashboard sync: 42 metrics loaded',
  'Revenue forecast model: v4.2 active',
  'Risk assessment engine: scanning...',
  'Market signal detected: fintech +18%',
  'Competitor analysis: 12 companies tracked',
  'Growth opportunity identified: APAC market',
  'Strategy iteration #42 complete',
  'Decision tree updated — 3 branches added',
  'Recommendation: increase R&D allocation 12%',
  'Risk alert: supply chain volatility APAC',
  'Mitigation plan generated: 4 actions queued',
  'KPI threshold: customer acquisition +18%',
  'Forecast confidence: 92.4%',
  'Weekly review report compiled ✓',
  'Auto-scheduling review...',
  'STRATEGIST: all systems nominal',
];

const REASONING_FEED = [
  'Analyzing 42 KPIs across 6 departments...',
  'Revenue trend shows 18% MoM growth',
  'Customer acquisition cost decreased by 12%',
  'Market share analysis: +1.8% this quarter',
  'Competitor pricing strategy detected — adjusting',
  'Risk detected: supply chain volatility in APAC',
  'Recommendation: Increase automation budget by 12%',
  'New market opportunity: APAC fintech sector',
  'Cash flow projection: 92% confidence interval',
  'Resource allocation optimized for Q3',
  'Decision: approve product diversification plan',
  'Sentiment analysis: market confidence rising',
];

export default function StrategistWorkspace() {
  const { addActivity, workforcePaused, emergencyStop } = useOS();
  const [generating, setGenerating] = useState(false);
  const [strategy, setStrategy] = useState('');
  const [kpis, setKpis] = useState({ revenue: 342800, growth: 18, customers: 142, churn: 2.8, marketShare: 4.2, cac: 4200 });
  const [reasoning, setReasoning] = useState<string[]>([]);
  const [risks] = useState<{ text: string; level: string }[]>([
    { text: 'APAC supply chain volatility', level: 'medium' },
    { text: 'Competitor pricing pressure', level: 'low' },
  ]);

  const fullStrategy = `STRATEGIC GROWTH PLAN — Q3 2026

PHASE 1: Market Expansion (Weeks 1-4)
• Target Tier-1 enterprise accounts in fintech sector
• Deploy HUNTER AI for automated outbound campaigns
• Projected pipeline growth: +₹4,18,000

PHASE 2: Product Diversification (Weeks 5-8)
• Launch AI workforce templates for retail vertical
• Cross-sell automation packages to existing customers
• Projected revenue uplift: +12%

PHASE 3: Geographic Scaling (Weeks 9-12)
• Expand operations to APAC and EMEA markets
• Establish autonomous support infrastructure
• Projected customer base growth: +40%

RISK ASSESSMENT: LOW
• Supply chain volatility mitigated via AUTOMATOR
• Compliance maintained at 100% via FINANCE
• Customer satisfaction guarded by GUARDIAN

FORECAST: Monthly revenue ₹4,18,000 (+18%)
CONFIDENCE: 92.4%`;

  const generate = () => {
    setGenerating(true);
    setStrategy('');
    let i = 0;
    const interval = setInterval(() => {
      setStrategy(fullStrategy.slice(0, i));
      i += 4;
      if (i > fullStrategy.length) {
        clearInterval(interval);
        setGenerating(false);
        addActivity('STRATEGIST', 'generated strategy', 'Q3 growth plan created — +18% revenue projection');
      }
    }, 15);
  };

  useEffect(() => {
    if (workforcePaused || emergencyStop) return;
    const interval = setInterval(() => {
      setKpis((prev) => ({
        revenue: prev.revenue + Math.floor(Math.random() * 200),
        growth: Math.max(14, Math.min(24, prev.growth + (Math.random() - 0.5) * 0.3)),
        customers: prev.customers + (Math.random() > 0.7 ? 1 : 0),
        churn: Math.max(1.5, Math.min(4, prev.churn + (Math.random() - 0.5) * 0.08)),
        marketShare: Math.max(2, Math.min(8, prev.marketShare + (Math.random() - 0.5) * 0.05)),
        cac: Math.max(3000, Math.min(6000, prev.cac + (Math.random() - 0.5) * 30)),
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, [workforcePaused, emergencyStop]);

  useEffect(() => {
    if (workforcePaused || emergencyStop) return;
    const interval = setInterval(() => {
      const item = REASONING_FEED[Math.floor(Math.random() * REASONING_FEED.length)];
      setReasoning((prev) => [...prev.slice(-5), item]);
    }, 2800);
    return () => clearInterval(interval);
  }, [workforcePaused, emergencyStop]);

  return (
    <WorkspaceShell employeeId="strategist" terminalLines={TERMINAL_LINES}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Live KPI Dashboard</h3>
            <span className="ml-auto font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● LIVE</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <KPI label="Monthly Revenue" value={`₹${(kpis.revenue / 100000).toFixed(2)}L`} change="+18%" color={C.hex} />
            <KPI label="Growth" value={`${kpis.growth.toFixed(1)}%`} change="+3.2%" color={C.hex} />
            <KPI label="Customers" value={kpis.customers.toString()} change="+8" color={C.hex} />
            <KPI label="Churn" value={`${kpis.churn.toFixed(1)}%`} change="-0.3%" negative color={C.hex} />
            <KPI label="Market Share" value={`${kpis.marketShare.toFixed(1)}%`} change="+0.4%" color={C.hex} />
            <KPI label="CAC" value={`₹${Math.floor(kpis.cac)}`} change="-12%" negative color={C.hex} />
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] text-white/50">Revenue Flow — Real-Time</span>
              <span className="font-mono text-[11px] tabular-nums" style={{ color: C.hex }}>₹{(kpis.revenue / 100000).toFixed(2)}L</span>
            </div>
            <LiveGraph label="" height={88} color={C.hex} baseValue={65} volatility={8} updateInterval={700} />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">AI Reasoning</h3>
            <span className="ml-auto font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● THINKING</span>
          </div>
          <div className="space-y-2.5 text-xs h-44 overflow-y-auto no-scrollbar">
            {reasoning.length === 0 ? (
              <div className="text-white/30 font-mono text-xs">Initializing reasoning engine...</div>
            ) : (
              reasoning.map((text, i) => (
                <div key={i} className="flex items-start gap-2" style={{ animation: 'fade-in 0.4s ease' }}>
                  <span className="mt-0.5" style={{ color: C.hex }}>›</span>
                  <span className="text-white/60 leading-relaxed">{text}</span>
                </div>
              ))
            )}
          </div>
          <style>{`@keyframes fade-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }`}</style>
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-3.5 h-3.5 text-yellow-400" />
              <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider">Risk Alerts</span>
            </div>
            {risks.map((risk, i) => (
              <div key={i} className="flex items-center gap-2 text-xs mb-1.5">
                <AlertTriangle className={`w-3 h-3 ${risk.level === 'medium' ? 'text-yellow-400' : 'text-green-400'}`} />
                <span className="text-white/60">{risk.text}</span>
                <span className={`ml-auto font-mono text-[9px] ${risk.level === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>{risk.level.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Strategy Timeline</h3>
          </div>
          <div className="space-y-3">
            {[
              { phase: 'Phase 1', title: 'Market Expansion', weeks: 'Weeks 1-4', status: 'active', progress: 65 },
              { phase: 'Phase 2', title: 'Product Diversification', weeks: 'Weeks 5-8', status: 'pending', progress: 0 },
              { phase: 'Phase 3', title: 'Geographic Scaling', weeks: 'Weeks 9-12', status: 'pending', progress: 0 },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: p.status === 'active' ? C.hex : 'rgba(255,255,255,0.15)', animation: p.status === 'active' ? 'pulse 2s infinite' : 'none' }} />
                <div className="flex-1 glass rounded-lg px-4 py-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="font-mono text-[10px]" style={{ color: C.hex }}>{p.phase}</span>
                      <div className="font-display text-[13px] text-white">{p.title}</div>
                    </div>
                    <span className="font-mono text-[10px] text-white/40">{p.weeks}</span>
                  </div>
                  {p.status === 'active' && (
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${p.progress}%`, background: `linear-gradient(to right, ${C.hex}80, ${C.hex})` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Strategy Generator</h3>
          </div>
          <button
            onClick={generate}
            disabled={generating}
            className="w-full text-white font-medium text-[13px] py-2.5 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: `linear-gradient(to right, ${C.hex}, ${C.hex}cc)`, boxShadow: `0 0 16px rgba(${C.rgb},0.25)` }}
          >
            {generating ? 'Generating...' : 'Generate Growth Strategy'}
          </button>
          {strategy && (
            <div className="mt-3 flex-1 glass rounded-lg p-3.5 max-h-56 overflow-y-auto no-scrollbar">
              <pre className="font-mono text-[10px] text-white/70 whitespace-pre-wrap leading-relaxed">{strategy}<span className="animate-pulse" style={{ color: C.hex }}>▊</span></pre>
            </div>
          )}
        </GlassCard>
      </div>
    </WorkspaceShell>
  );
}

function KPI({ label, value, change, negative, color }: { label: string; value: string; change: string; negative?: boolean; color: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="font-mono text-[9px] text-white/40 uppercase tracking-wider">{label}</div>
      <div className="font-display text-[15px] font-bold text-white mt-1 tabular-nums">{value}</div>
      <div className="font-mono text-[9px] mt-0.5" style={{ color: negative ? '#00ff88' : color }}>{change}</div>
    </div>
  );
}
