import { useState, useEffect } from 'react';
import WorkspaceShell from './WorkspaceShell';
import GlassCard from '../ui/GlassCard';
import LiveGraph from '../visuals/LiveGraph';
import { useOS } from '../../os/store';
import { NEON_COLORS } from '../../data/employees';
import { Workflow, Zap, Database, CheckCircle2, Webhook, Activity, Cpu } from 'lucide-react';

const C = NEON_COLORS.lime;
const TERMINAL_LINES = [
  'AUTOMATOR AI booting...',
  'Loading workflow engine: n8n v1.4...',
  'Connecting to 8 services: Slack, Gmail, Notion, Stripe...',
  'API gateway: 7 endpoints active',
  'Workflow #327: webhook received',
  'Workflow #327: fetching data from CRM...',
  'Workflow #327: AI processing — sentiment analysis',
  'Workflow #327: auto-approval triggered — threshold met',
  'Workflow #327: invoice generated — ₹4,200',
  'Workflow #327: database sync — 7 services updated',
  'Workflow #327: execution SUCCESS ✓',
  'API call: POST /v1/workforce/deploy — 200 OK',
  'API call: GET /v1/leads — 200 OK — 42 results',
  'API call: PATCH /v1/invoices/0847 — 200 OK',
  'Database backup: verified — 0 conflicts',
  'n8n pipeline: 327 workflows running',
  'Zapier bridge: 12 zaps active',
  'Invoice approval: auto-approved ₹2,400',
  'AUTOMATOR: all systems nominal',
];

const WORKFLOW_NODES = [
  { id: 'trigger', label: 'Webhook', x: 10, y: 50, icon: Webhook },
  { id: 'fetch', label: 'Fetch Data', x: 28, y: 30, icon: Database },
  { id: 'process', label: 'AI Process', x: 46, y: 50, icon: Zap },
  { id: 'approve', label: 'Auto-Approve', x: 64, y: 30, icon: CheckCircle2 },
  { id: 'invoice', label: 'Generate Invoice', x: 64, y: 70, icon: Workflow },
  { id: 'sync', label: 'DB Sync', x: 82, y: 50, icon: Database },
];

const CONNECTIONS: [string, string][] = [
  ['trigger', 'fetch'], ['fetch', 'process'], ['process', 'approve'],
  ['process', 'invoice'], ['approve', 'sync'], ['invoice', 'sync'],
];

const CONNECTED_APPS = ['n8n', 'Zapier', 'Slack', 'Gmail', 'Notion', 'Stripe', 'HubSpot', 'Sheets'];

export default function AutomatorWorkspace() {
  const { addActivity, workforcePaused, emergencyStop } = useOS();
  const [running, setRunning] = useState(false);
  const [activeNode, setActiveNode] = useState(-1);
  const [logs, setLogs] = useState<string[]>([]);
  const [executions, setExecutions] = useState(327);
  const [apiCalls, setApiCalls] = useState(4821);
  const [successRate, setSuccessRate] = useState(99.2);

  const runWorkflow = () => {
    setRunning(true); setLogs([]); setActiveNode(0);
    const steps = ['Webhook received — payload validated', 'Fetching customer data from CRM...', 'AI processing — sentiment analysis complete', 'Auto-approval triggered — threshold met', 'Invoice generated — ₹4,200', 'Database sync complete — 7 services updated', 'Workflow execution successful ✓'];
    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step]); setActiveNode(i);
        if (i === steps.length - 1) { setRunning(false); setExecutions((e) => e + 1); setApiCalls((a) => a + Math.floor(Math.random() * 12)); addActivity('AUTOMATOR', 'completed workflow', `Execution #${executions + 1} — all nodes passed`); }
      }, i * 600);
    });
  };

  useEffect(() => {
    if (workforcePaused || emergencyStop) return;
    const interval = setInterval(() => {
      setApiCalls((a) => a + Math.floor(Math.random() * 3));
      setSuccessRate((s) => Math.max(98.5, Math.min(99.9, s + (Math.random() - 0.5) * 0.03)));
    }, 1800);
    return () => clearInterval(interval);
  }, [workforcePaused, emergencyStop]);

  return (
    <WorkspaceShell employeeId="automator" terminalLines={TERMINAL_LINES}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Workflow className="w-4 h-4" style={{ color: C.hex }} />
              <h3 className="font-display text-sm font-bold text-white">Workflow Canvas</h3>
              <span className="font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● LIVE</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-white/40">{executions} runs</span>
              <span className="text-white/40">{apiCalls.toLocaleString('en-IN')} API calls</span>
            </div>
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden glass">
            <div className="absolute inset-0 grid-bg-cyan opacity-20" />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {CONNECTIONS.map(([from, to], i) => {
                const a = WORKFLOW_NODES.find((n) => n.id === from)!; const b = WORKFLOW_NODES.find((n) => n.id === to)!;
                const isActive = running && activeNode >= 0 && (WORKFLOW_NODES.findIndex((n) => n.id === from) <= activeNode && WORKFLOW_NODES.findIndex((n) => n.id === to) <= activeNode + 1);
                return <path key={i} d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${a.y}, ${(a.x + b.x) / 2} ${(a.y + b.y) / 2} T ${b.x} ${b.y}`} fill="none" stroke={isActive ? C.hex : `rgba(${C.rgb},0.15)`} strokeWidth="0.5" strokeDasharray="2 1" style={isActive ? { animation: 'dash-flow 0.5s linear infinite' } : {}} />;
              })}
              <style>{`@keyframes dash-flow { to { stroke-dashoffset: -3; } }`}</style>
            </svg>
            {WORKFLOW_NODES.map((node, i) => {
              const Icon = node.icon; const isActive = running && i === activeNode; const isDone = running && i < activeNode;
              return (
                <div key={node.id} className="absolute" style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}>
                  <div className="relative w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-300" style={{ background: isActive || isDone ? `linear-gradient(135deg, rgba(${C.rgb},0.12), rgba(${C.rgb},0.02))` : undefined, border: isActive ? `1px solid rgba(${C.rgb},0.45)` : isDone ? `1px solid rgba(${C.rgb},0.2)` : '1px solid rgba(255,255,255,0.06)', transform: isActive ? 'scale(1.1)' : 'scale(1)', boxShadow: isActive ? `0 0 16px rgba(${C.rgb},0.25)` : 'none' }}>
                    <Icon className="w-4 h-4" style={{ color: isActive || isDone ? C.hex : 'rgba(255,255,255,0.4)' }} />
                    <span className="font-mono text-[7px] text-white/60 text-center leading-tight">{node.label}</span>
                    {isDone && <CheckCircle2 className="absolute -top-1 -right-1 w-3 h-3" style={{ color: C.hex }} />}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={runWorkflow} disabled={running} className="w-full mt-4 text-white font-medium text-[13px] py-2.5 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50" style={{ background: `linear-gradient(to right, ${C.hex}, ${C.hex}cc)`, boxShadow: `0 0 16px rgba(${C.rgb},0.25)` }}>
            {running ? 'Executing workflow...' : 'Run Workflow'}
          </button>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Execution Logs</h3>
          </div>
          <div className="flex-1 space-y-1.5 max-h-44 overflow-y-auto no-scrollbar">
            {logs.length === 0 ? <div className="text-white/30 font-mono text-xs text-center py-8">No executions yet. Run workflow to see logs.</div> : logs.map((log, i) => (
              <div key={i} className="glass rounded px-3 py-2 font-mono text-[10px] text-white/60" style={{ animation: 'log-in 0.3s ease' }}>
                <span style={{ color: C.hex }}>[{String(i + 1).padStart(2, '0')}]</span> {log}
              </div>
            ))}
          </div>
          <style>{`@keyframes log-in { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }`}</style>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">API Throughput</h3>
            <span className="ml-auto font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● LIVE</span>
          </div>
          <LiveGraph label="REQUESTS/s" height={72} color={C.hex} baseValue={50} volatility={16} updateInterval={600} />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="glass rounded-lg p-2.5 text-center"><div className="font-display text-[15px] font-bold tabular-nums" style={{ color: C.hex }}>{successRate.toFixed(1)}%</div><div className="font-mono text-[9px] text-white/40">Success Rate</div></div>
            <div className="glass rounded-lg p-2.5 text-center"><div className="font-display text-[15px] font-bold tabular-nums" style={{ color: C.hex }}>0.3ms</div><div className="font-mono text-[9px] text-white/40">Avg Latency</div></div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Connected Apps</h3>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2.5">
            {CONNECTED_APPS.map((app, i) => (
              <div key={app} className="glass rounded-lg p-2.5 flex flex-col items-center gap-1 hover:glass-strong transition-all" style={{ animation: `fade-in 0.3s ease ${i * 0.05}s both` }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, rgba(${C.rgb},0.12), rgba(${C.rgb},0.02))`, border: `1px solid rgba(${C.rgb},0.2)` }}>
                  <span className="font-display font-bold text-[10px]" style={{ color: C.hex }}>{app[0]}</span>
                </div>
                <span className="font-mono text-[8px] text-white/50">{app}</span>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.hex }} />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-display text-sm font-bold text-white mb-4">API Monitor</h3>
          <div className="space-y-2">
            {[
              { name: 'REST API', status: '200 OK', latency: '0.3ms' },
              { name: 'GraphQL', status: '200 OK', latency: '0.8ms' },
              { name: 'Webhook', status: '200 OK', latency: '1.2ms' },
              { name: 'Database', status: '200 OK', latency: '0.5ms' },
              { name: 'Queue', status: '200 OK', latency: '0.2ms' },
            ].map((api) => (
              <div key={api.name} className="glass rounded-lg px-3 py-2 flex items-center justify-between">
                <span className="font-mono text-[10px] text-white/60">{api.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-green-400">{api.status}</span>
                  <span className="font-mono text-[9px] text-white/30 tabular-nums">{api.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      <style>{`@keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </WorkspaceShell>
  );
}
