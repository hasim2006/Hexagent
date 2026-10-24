import { useState, useEffect } from 'react';
import WorkspaceShell from './WorkspaceShell';
import GlassCard from '../ui/GlassCard';
import LiveGraph from '../visuals/LiveGraph';
import { useOS } from '../../os/store';
import { NEON_COLORS } from '../../data/employees';
import { Target, Mail, Calendar, MapPin, TrendingUp, Phone } from 'lucide-react';

const C = NEON_COLORS.rose;
const TERMINAL_LINES = [
  'HUNTER AI booting...',
  'Loading prospect database: 12,400 companies...',
  'Connecting to CRM: HubSpot API ✓',
  'Lead scoring model: v3.1 active',
  'Scanning prospect database...',
  'Lead identified: TechFlow Solutions — score 87',
  'Lead identified: Nimbus Analytics — score 92',
  'Outreach sequence triggered: 48 prospects',
  'Email campaign: 23% open rate, 8% reply rate',
  'Meeting scheduled: Vertex Labs — Thursday 2pm',
  'Deal closed: Helix Health — ₹48,000',
  'Pipeline updated: +₹4,18,000',
  'Lead score recalculated: 89/100',
  'Cold email generated: personalized ✓',
  'Follow-up scheduled: 12 prospects',
  'CRM sync: all records updated',
  'HUNTER: scanning complete — 42 new leads',
  'Auto-prioritizing high-value targets...',
  'HUNTER: all systems nominal',
];

const COMPANIES = [
  { name: 'TechFlow Solutions', industry: 'SaaS', score: 87, value: '₹48,000', location: 'Mumbai', contact: 'CTO' },
  { name: 'Nimbus Analytics', industry: 'Fintech', score: 92, value: '₹72,000', location: 'Bangalore', contact: 'VP Eng' },
  { name: 'Quantum Retail', industry: 'E-commerce', score: 76, value: '₹24,000', location: 'Delhi', contact: 'CEO' },
  { name: 'Vertex Labs', industry: 'AI/ML', score: 95, value: '₹1,12,000', location: 'San Francisco', contact: 'CTO' },
  { name: 'Helix Health', industry: 'HealthTech', score: 81, value: '₹42,000', location: 'London', contact: 'COO' },
  { name: 'Orbit Dynamics', industry: 'Aerospace', score: 88, value: '₹86,000', location: 'Tokyo', contact: 'VP Ops' },
];

const NEW_COMPANIES = [
  { name: 'Cipher Systems', industry: 'Cybersecurity', score: 89, value: '₹62,000', location: 'Berlin', contact: 'CISO' },
  { name: 'Pulse Commerce', industry: 'E-commerce', score: 84, value: '₹36,000', location: 'Singapore', contact: 'CEO' },
  { name: 'Nexus Energy', industry: 'CleanTech', score: 91, value: '₹94,000', location: 'Dubai', contact: 'CTO' },
  { name: 'Stellar Foods', industry: 'FoodTech', score: 78, value: '₹30,000', location: 'Sydney', contact: 'COO' },
  { name: 'Apex Robotics', industry: 'Robotics', score: 93, value: '₹1,04,000', location: 'Tokyo', contact: 'VP R&D' },
  { name: 'Flux Capital', industry: 'Fintech', score: 86, value: '₹56,000', location: 'New York', contact: 'CFO' },
];

export default function HunterWorkspace() {
  const { addActivity, workforcePaused, emergencyStop } = useOS();
  const [leads, setLeads] = useState(COMPANIES);
  const [finding, setFinding] = useState(false);
  const [pipeline, setPipeline] = useState(418000);
  const [email, setEmail] = useState('');
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [dealsClosed] = useState(23);
  const [conversionRate, setConversionRate] = useState(28);
  const [outreach, setOutreach] = useState({ sent: 482, opened: 311, replied: 38 });

  const findLeads = () => {
    setFinding(true);
    setTimeout(() => {
      const newLead = NEW_COMPANIES[Math.floor(Math.random() * NEW_COMPANIES.length)];
      setLeads((prev) => [{ ...newLead, score: newLead.score + Math.floor(Math.random() * 5) }, ...prev].slice(0, 8));
      setPipeline((p) => p + Math.floor(Math.random() * 20000));
      setOutreach((o) => ({ ...o, sent: o.sent + Math.floor(Math.random() * 8) }));
      setFinding(false);
      addActivity('HUNTER', 'found leads', `${newLead.name} identified — score ${newLead.score}/100`);
    }, 2000);
  };

  const generateEmail = () => {
    setGeneratingEmail(true);
    setEmail('');
    const text = `Subject: Transforming ${leads[0].name}'s ${leads[0].industry} operations with AI

Hi ${leads[0].contact} at ${leads[0].name},

I've been analyzing your industry presence in ${leads[0].location} and noticed an opportunity to automate key workflows that could save your team 40+ hours monthly.

Our AI workforce has helped similar ${leads[0].industry} companies increase revenue by 18% while reducing operational costs by 25%.

Would you be open to a 15-minute call this week to explore this?

Best,
HUNTER AI — made with Hasim`;
    let i = 0;
    const interval = setInterval(() => {
      setEmail(text.slice(0, i));
      i += 5;
      if (i > text.length) { clearInterval(interval); setGeneratingEmail(false); }
    }, 10);
  };

  useEffect(() => {
    if (workforcePaused || emergencyStop) return;
    const interval = setInterval(() => {
      setOutreach((o) => ({ sent: o.sent + Math.floor(Math.random() * 2), opened: o.opened + (Math.random() > 0.6 ? 1 : 0), replied: o.replied + (Math.random() > 0.85 ? 1 : 0) }));
      setConversionRate((c) => Math.max(22, Math.min(34, c + (Math.random() - 0.5) * 0.3)));
    }, 2500);
    return () => clearInterval(interval);
  }, [workforcePaused, emergencyStop]);

  return (
    <WorkspaceShell employeeId="hunter" terminalLines={TERMINAL_LINES}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" style={{ color: C.hex }} />
              <h3 className="font-display text-sm font-bold text-white">Live CRM</h3>
              <span className="font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● LIVE</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-white/40">Pipeline: <span style={{ color: C.hex }}>₹{(pipeline / 100000).toFixed(2)}L</span></span>
              <span className="text-white/40">{leads.length} leads</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <OutreachStat label="Sent" value={outreach.sent.toString()} color={C.hex} />
            <OutreachStat label="Opened" value={outreach.opened.toString()} color={C.hex} />
            <OutreachStat label="Replied" value={outreach.replied.toString()} color={C.hex} />
            <OutreachStat label="Conversion" value={`${conversionRate.toFixed(1)}%`} color={C.hex} />
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
            {leads.map((lead, i) => (
              <div key={lead.name + i} className="glass rounded-lg p-2.5 flex items-center gap-3 hover:glass-strong transition-all" style={{ animation: 'slide-in 0.4s ease' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, rgba(${C.rgb},0.12), rgba(${C.rgb},0.02))`, border: `1px solid rgba(${C.rgb},0.25)` }}>
                  <span className="font-display font-bold text-xs" style={{ color: C.hex }}>{lead.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[13px] text-white truncate">{lead.name}</div>
                  <div className="flex items-center gap-1.5 font-mono text-[9px] text-white/40">
                    <span>{lead.industry}</span><span>•</span>
                    <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{lead.location}</span>
                    <span>•</span><span>{lead.contact}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-14 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${lead.score}%`, background: `linear-gradient(to right, ${C.hex}80, ${C.hex})` }} />
                    </div>
                    <span className="font-mono text-[11px] w-6 tabular-nums" style={{ color: C.hex }}>{lead.score}</span>
                  </div>
                  <div className="font-mono text-[10px] text-white/50 mt-0.5 tabular-nums">{lead.value}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={findLeads} disabled={finding} className="w-full mt-4 text-white font-medium text-[13px] py-2.5 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50" style={{ background: `linear-gradient(to right, ${C.hex}, ${C.hex}cc)`, boxShadow: `0 0 16px rgba(${C.rgb},0.25)` }}>
            {finding ? 'Scanning prospect database...' : 'Find New Leads'}
          </button>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Cold Email Generator</h3>
          </div>
          <button onClick={generateEmail} disabled={generatingEmail} className="w-full glass text-white/70 hover:glass-strong font-mono text-xs py-2.5 rounded-lg transition-all disabled:opacity-50">
            {generatingEmail ? 'Writing...' : 'Generate Outreach Email'}
          </button>
          {email && (
            <div className="mt-3 flex-1 glass rounded-lg p-3.5 max-h-44 overflow-y-auto no-scrollbar">
              <pre className="font-mono text-[10px] text-white/70 whitespace-pre-wrap leading-relaxed">{email}<span className="animate-pulse" style={{ color: C.hex }}>▊</span></pre>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Pipeline Growth</h3>
            <span className="ml-auto font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● LIVE</span>
          </div>
          <LiveGraph label="PIPELINE" unit="₹" height={80} color={C.hex} baseValue={55} volatility={12} updateInterval={800} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="glass rounded-lg p-2.5 text-center">
              <div className="font-display text-[17px] font-bold tabular-nums" style={{ color: C.hex }}>{dealsClosed}</div>
              <div className="font-mono text-[9px] text-white/40">Deals Closed</div>
            </div>
            <div className="glass rounded-lg p-2.5 text-center">
              <div className="font-display text-[17px] font-bold tabular-nums" style={{ color: C.hex }}>₹{(pipeline / 100000).toFixed(1)}L</div>
              <div className="font-mono text-[9px] text-white/40">Pipeline Value</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Lead Heatmap</h3>
          </div>
          <LeadMap leads={leads} color={C.hex} />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Outreach History</h3>
          </div>
          <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar">
            {[
              { action: 'Email sent', target: 'TechFlow Solutions', time: '2m ago', icon: Mail },
              { action: 'Meeting booked', target: 'Nimbus Analytics', time: '1h ago', icon: Calendar },
              { action: 'Call scheduled', target: 'Vertex Labs', time: '2h ago', icon: Phone },
              { action: 'Follow-up sent', target: 'Helix Health', time: '3h ago', icon: Mail },
              { action: 'Deal closed', target: 'Orbit Dynamics', time: '5h ago', icon: TrendingUp },
              { action: 'Email sent', target: 'Quantum Retail', time: '6h ago', icon: Mail },
            ].map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={i} className="glass rounded-lg px-3 py-2 flex items-center gap-2">
                  <Icon className="w-3 h-3" style={{ color: C.hex }} />
                  <div className="flex-1">
                    <div className="text-[11px] text-white/70">{h.action}</div>
                    <div className="font-mono text-[10px]" style={{ color: C.hex }}>{h.target}</div>
                  </div>
                  <span className="font-mono text-[9px] text-white/30">{h.time}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
      <style>{`@keyframes slide-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </WorkspaceShell>
  );
}

function OutreachStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-lg p-2.5 text-center">
      <div className="font-display text-[15px] font-bold tabular-nums" style={{ color }}>{value}</div>
      <div className="font-mono text-[9px] text-white/40">{label}</div>
    </div>
  );
}

function LeadMap({ leads, color }: { leads: typeof COMPANIES; color: string }) {
  const locations: Record<string, { x: number; y: number }> = {
    Mumbai: { x: 68, y: 48 }, Bangalore: { x: 71, y: 56 }, Delhi: { x: 70, y: 40 },
    London: { x: 47, y: 32 }, 'San Francisco': { x: 15, y: 40 }, Tokyo: { x: 85, y: 40 },
    Berlin: { x: 51, y: 30 }, Singapore: { x: 78, y: 58 }, Dubai: { x: 60, y: 48 }, Sydney: { x: 88, y: 72 },
    'New York': { x: 27, y: 38 },
  };
  return (
    <div className="relative h-44 rounded-lg overflow-hidden glass">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid meet">
        {Array.from({ length: 150 }).map((_, i) => {
          const x = (i * 37) % 100; const y = (i * 53) % 80;
          const inLand = (x > 10 && x < 30 && y > 25 && y < 55) || (x > 44 && x < 58 && y > 20 && y < 55) || (x > 55 && x < 75 && y > 20 && y < 55) || (x > 75 && x < 90 && y > 35 && y < 75);
          return inLand ? <circle key={i} cx={x} cy={y} r="0.4" fill="rgba(255,255,255,0.06)" /> : null;
        })}
        {leads.map((l, i) => {
          const loc = locations[l.location]; if (!loc) return null;
          return (
            <g key={i}>
              <circle cx={loc.x} cy={loc.y} r={l.score / 30} fill={`${color}99`} />
              <circle cx={loc.x} cy={loc.y} r={l.score / 15} fill="none" stroke={`${color}50`} strokeWidth="0.3" style={{ animation: `map-pulse 2s ease-in-out infinite ${i * 0.2}s` }} />
              <text x={loc.x} y={loc.y - 3} fill="rgba(255,255,255,0.4)" fontSize="2" textAnchor="middle" className="font-mono">{l.name}</text>
            </g>
          );
        })}
      </svg>
      <style>{`@keyframes map-pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.8; } }`}</style>
    </div>
  );
}
