import { useState, useEffect } from 'react';
import WorkspaceShell from './WorkspaceShell';
import GlassCard from '../ui/GlassCard';
import LiveGraph from '../visuals/LiveGraph';
import { useOS } from '../../os/store';
import { NEON_COLORS } from '../../data/employees';
import { TrendingUp, DollarSign, Receipt, PieChart, FileText, Calculator, ArrowDown } from 'lucide-react';

const C = NEON_COLORS.amber;
const TERMINAL_LINES = [
  'FINANCE AI booting...',
  'Loading financial models: P&L, cashflow, forecast...',
  'Connecting to banking APIs: 4 accounts...',
  'Invoice processing: 7 pending...',
  'Invoice #INV-0847: processed — ₹4,200 ✓',
  'Invoice #INV-0848: processed — ₹7,200 ✓',
  'Cashflow forecast: updated — 92% confidence',
  'Tax estimation: GST ₹61,704, Income Tax ₹17,850',
  'Profit margin: +21% — above target',
  'Revenue recognition: ₹3,42,800 recognized',
  'Expense allocation: R&D 30%, Sales 25%, Ops 20%',
  'Budget variance: -2.3% (under budget)',
  'Forecast: ₹4,18,000 (+18%)',
  'Compliance check: 100% GST compliant',
  'Monthly report: compiled ✓',
  'FINANCE: all systems nominal',
];

export default function FinanceWorkspace() {
  const { addActivity, workforcePaused, emergencyStop } = useOS();
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState('');
  const [revenue, setRevenue] = useState(342800);
  const [expenses, setExpenses] = useState(270800);
  const [forecast, setForecast] = useState(418000);
  const [invoices] = useState([
    { id: 'INV-0847', client: 'TechFlow Solutions', amount: '₹4,200', status: 'paid' },
    { id: 'INV-0848', client: 'Nimbus Analytics', amount: '₹7,200', status: 'pending' },
    { id: 'INV-0849', client: 'Vertex Labs', amount: '₹12,000', status: 'paid' },
    { id: 'INV-0850', client: 'Helix Health', amount: '₹3,800', status: 'overdue' },
    { id: 'INV-0851', client: 'Orbit Dynamics', amount: '₹8,600', status: 'pending' },
  ]);

  const profit = revenue - expenses;
  const margin = (profit / revenue) * 100;

  const generateReport = () => {
    setGenerating(true); setReport('');
    const text = `MONTHLY FINANCIAL REPORT — July 2026

REVENUE:           ₹${revenue.toLocaleString('en-IN')}
EXPENSES:          ₹${expenses.toLocaleString('en-IN')}
NET PROFIT:        ₹${profit.toLocaleString('en-IN')}
PROFIT MARGIN:     ${margin.toFixed(1)}%

REVENUE BREAKDOWN:
  • SaaS Subscriptions:  ₹${Math.floor(revenue * 0.45).toLocaleString('en-IN')}
  • Enterprise Licenses: ₹${Math.floor(revenue * 0.30).toLocaleString('en-IN')}
  • Professional Services: ₹${Math.floor(revenue * 0.15).toLocaleString('en-IN')}
  • API Usage:           ₹${Math.floor(revenue * 0.10).toLocaleString('en-IN')}

EXPENSE BREAKDOWN:
  • Infrastructure:      ₹${Math.floor(expenses * 0.35).toLocaleString('en-IN')}
  • AI Compute:          ₹${Math.floor(expenses * 0.25).toLocaleString('en-IN')}
  • Operations:          ₹${Math.floor(expenses * 0.20).toLocaleString('en-IN')}
  • Marketing:           ₹${Math.floor(expenses * 0.20).toLocaleString('en-IN')}

FORECAST (Next Month):
  • Projected Revenue:   ₹${forecast.toLocaleString('en-IN')}
  • Growth Rate:         +${(((forecast - revenue) / revenue) * 100).toFixed(1)}%
  • Confidence:          92.2%

TAX ESTIMATION:
  • GST Liability:       ₹${Math.floor(revenue * 0.18).toLocaleString('en-IN')}
  • Income Tax:          ₹${Math.floor(profit * 0.25).toLocaleString('en-IN')}
  • Compliance Status:   100% COMPLIANT

STATUS: ALL FINANCIAL METRICS NOMINAL.`;
    let i = 0;
    const interval = setInterval(() => { setReport(text.slice(0, i)); i += 5; if (i > text.length) { clearInterval(interval); setGenerating(false); addActivity('FINANCE', 'generated report', 'Monthly financial report compiled — profit margin ' + margin.toFixed(1) + '%'); } }, 12);
  };

  useEffect(() => {
    if (workforcePaused || emergencyStop) return;
    const interval = setInterval(() => {
      setRevenue((r) => r + Math.floor(Math.random() * 200));
      setExpenses((e) => Math.max(250000, Math.min(300000, e + Math.floor((Math.random() - 0.5) * 300))));
      setForecast((f) => f + Math.floor(Math.random() * 100));
    }, 2500);
    return () => clearInterval(interval);
  }, [workforcePaused, emergencyStop]);

  return (
    <WorkspaceShell employeeId="finance" terminalLines={TERMINAL_LINES}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Profit Dashboard</h3>
            <span className="ml-auto font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● LIVE</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <FinanceStat label="Monthly Revenue" value={`₹${(revenue / 100000).toFixed(2)}L`} icon={DollarSign} change="+18%" color={C.hex} />
            <FinanceStat label="Expenses" value={`₹${(expenses / 100000).toFixed(2)}L`} icon={ArrowDown} change="-3%" negative color={C.hex} />
            <FinanceStat label="Net Profit" value={`₹${(profit / 100000).toFixed(2)}L`} icon={TrendingUp} change="+21%" color={C.hex} />
            <FinanceStat label="Margin" value={`+${margin.toFixed(1)}%`} icon={PieChart} change="+5%" color={C.hex} />
          </div>
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[11px] text-white/50">Revenue Flow — Real-Time</span>
              <span className="font-mono text-[11px] tabular-nums" style={{ color: C.hex }}>₹${revenue.toLocaleString('en-IN')}</span>
            </div>
            <LiveGraph label="" height={80} color={C.hex} baseValue={65} volatility={8} updateInterval={700} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] text-white/50">Cashflow — 12 Months</span>
              <span className="font-mono text-[11px] tabular-nums" style={{ color: C.hex }}>+₹${(profit / 1000).toFixed(0)}K/mo</span>
            </div>
            <CashflowChart color={C.hex} />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Forecast</h3>
            <span className="ml-auto font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● LIVE</span>
          </div>
          <div className="text-center mb-4">
            <div className="font-display text-2xl font-bold tabular-nums" style={{ color: C.hex }}>₹{(forecast / 100000).toFixed(2)}L</div>
            <div className="font-mono text-[10px] text-white/40 mt-1">Next Month Projection</div>
          </div>
          <div className="space-y-2.5">
            <ForecastBar label="Conservative" value={380000} max={500000} color={C.hex} />
            <ForecastBar label="Expected" value={forecast} max={500000} color={C.hex} />
            <ForecastBar label="Optimistic" value={460000} max={500000} color={C.hex} />
          </div>
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[11px]"><span className="text-white/40">Forecast Accuracy</span><span className="font-mono tabular-nums" style={{ color: C.hex }}>92.2%</span></div>
            <div className="flex items-center justify-between text-[11px] mt-2"><span className="text-white/40">Growth Rate</span><span className="font-mono tabular-nums" style={{ color: C.hex }}>+{(((forecast - revenue) / revenue) * 100).toFixed(1)}%</span></div>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Recent Invoices</h3>
          </div>
          <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar">
            {invoices.map((inv) => (
              <div key={inv.id} className="glass rounded-lg p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px]" style={{ color: C.hex }}>{inv.id}</div>
                  <div className="text-[12px] text-white/60 truncate">{inv.client}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[11px] text-white/70 tabular-nums">{inv.amount}</div>
                  <div className={`font-mono text-[9px] ${inv.status === 'paid' ? 'text-green-400' : inv.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}`}>{inv.status}</div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Budget Allocation</h3>
          </div>
          <BudgetChart />
        </GlassCard>

        <GlassCard className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Report Generator</h3>
          </div>
          <button onClick={generateReport} disabled={generating} className="w-full text-white font-medium text-[13px] py-2.5 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50" style={{ background: `linear-gradient(to right, ${C.hex}, ${C.hex}cc)`, boxShadow: `0 0 16px rgba(${C.rgb},0.25)` }}>
            {generating ? 'Generating report...' : 'Generate Monthly Report'}
          </button>
          {report && (
            <div className="mt-3 flex-1 glass rounded-lg p-3.5 max-h-44 overflow-y-auto no-scrollbar">
              <pre className="font-mono text-[10px] text-white/70 whitespace-pre-wrap leading-relaxed">{report}<span className="animate-pulse" style={{ color: C.hex }}>▊</span></pre>
            </div>
          )}
        </GlassCard>
      </div>
    </WorkspaceShell>
  );
}

function FinanceStat({ label, value, icon: Icon, change, negative, color }: { label: string; value: string; icon: typeof DollarSign; change: string; negative?: boolean; color: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5" style={{ color }} />
        <span className="font-mono text-[9px] text-white/40 uppercase tracking-wider">{label}</span>
      </div>
      <div className="font-display text-[15px] font-bold text-white tabular-nums">{value}</div>
      <div className="font-mono text-[9px] mt-0.5" style={{ color: negative ? '#00ff88' : color }}>{change}</div>
    </div>
  );
}

function CashflowChart({ color }: { color: string }) {
  const revenue = [2.2, 2.4, 2.6, 2.5, 2.8, 2.7, 3.0, 2.9, 3.1, 3.2, 3.3, 3.4];
  const expenses = [1.8, 1.9, 2.0, 1.9, 2.1, 2.0, 2.2, 2.1, 2.3, 2.4, 2.5, 2.6];
  return (
    <div className="relative h-28">
      <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
        <path d={`M 0 ${50 - revenue[0] * 10} ${revenue.map((v, i) => `L ${(i / 11) * 100} ${50 - v * 10}`).join(' ')} L 100 50 L 0 50 Z`} fill={`${color}20`} />
        <path d={`M 0 ${50 - revenue[0] * 10} ${revenue.map((v, i) => `L ${(i / 11) * 100} ${50 - v * 10}`).join(' ')}`} fill="none" stroke={color} strokeWidth="0.8" />
        <path d={`M 0 ${50 - expenses[0] * 10} ${expenses.map((v, i) => `L ${(i / 11) * 100} ${50 - v * 10}`).join(' ')}`} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" strokeDasharray="1 1" />
      </svg>
      <div className="absolute bottom-1 left-0 right-0 flex justify-between font-mono text-[7px] text-white/30 px-1">
        {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m) => <span key={m}>{m}</span>)}
      </div>
    </div>
  );
}

function ForecastBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[10px] text-white/50">{label}</span>
        <span className="font-mono text-[10px] tabular-nums" style={{ color }}>₹{(value / 100000).toFixed(1)}L</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(value / max) * 100}%`, background: `linear-gradient(to right, ${color}80, ${color})` }} />
      </div>
    </div>
  );
}

function BudgetChart() {
  const segments = [
    { label: 'R&D', value: 30, color: '#ffb800' },
    { label: 'Sales', value: 25, color: '#ff6a00' },
    { label: 'Ops', value: 20, color: '#e85a00' },
    { label: 'Infra', value: 15, color: '#bf4700' },
    { label: 'Reserve', value: 10, color: '#8f3500' },
  ];
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width="90" height="90" viewBox="0 0 100 100" className="-rotate-90 flex-shrink-0">
        {segments.map((s) => {
          const dash = (s.value / 100) * 251;
          const el = <circle key={s.label} cx="50" cy="50" r="40" fill="none" stroke={s.color} strokeWidth="12" strokeDasharray={`${dash} 251`} strokeDashoffset={-offset} style={{ transition: 'stroke-dashoffset 1s ease' }} />;
          offset += dash; return el;
        })}
      </svg>
      <div className="space-y-1.5 flex-1">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="font-mono text-[10px] text-white/60 flex-1">{s.label}</span>
            <span className="font-mono text-[10px] text-white/40 tabular-nums">{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
