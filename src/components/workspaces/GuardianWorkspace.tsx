import { useState, useEffect } from 'react';
import WorkspaceShell from './WorkspaceShell';
import GlassCard from '../ui/GlassCard';
import LiveGraph from '../visuals/LiveGraph';
import { useOS } from '../../os/store';
import { NEON_COLORS } from '../../data/employees';
import { MessageSquare, Phone, Ticket, Smile, BookOpen, CheckCircle2, Clock } from 'lucide-react';

const C = NEON_COLORS.green;
const TERMINAL_LINES = [
  'GUARDIAN AI booting...',
  'Loading NLP models: sentiment v4.2...',
  'Connecting to support channels: chat, email, voice...',
  'Knowledge base: 124 articles indexed',
  'Ticket queue: 5 open tickets',
  'Processing ticket #4821 — billing inquiry...',
  'Sentiment analysis: neutral → positive',
  'Auto-reply generated: billing discrepancy corrected',
  'Ticket #4821: RESOLVED ✓ — satisfaction 5/5',
  'Live chat: new session started',
  'Voice call: transcribing audio...',
  'Sentiment graph: 78% positive, 18% neutral, 4% frustrated',
  'Auto-reply: knowledge base match 94%',
  'Resolution rate: 94% — above target',
  'Avg response time: 0.8s — excellent',
  'Customer satisfaction: 94.2%',
  'GUARDIAN: all systems nominal',
];

const TICKETS = [
  { id: '#4821', subject: 'Billing inquiry', priority: 'medium', sentiment: 'neutral', status: 'open' },
  { id: '#4822', subject: 'API integration help', priority: 'high', sentiment: 'frustrated', status: 'open' },
  { id: '#4823', subject: 'Feature request', priority: 'low', sentiment: 'positive', status: 'open' },
  { id: '#4824', subject: 'Account upgrade', priority: 'medium', sentiment: 'positive', status: 'open' },
  { id: '#4825', subject: 'Bug report — dashboard', priority: 'high', sentiment: 'frustrated', status: 'open' },
];

const AUTO_REPLIES: Record<string, string> = {
  '#4821': 'Hi! I can see your billing inquiry. Your invoice #INV-2024-0847 has been reviewed and the discrepancy has been corrected. A credit of ₹2,400 has been applied to your account. Is there anything else I can help with?',
  '#4822': 'I understand you need help with API integration. I\'ve pulled up our API documentation and can guide you through the setup. The endpoint you need is POST /v1/workforce/deploy with your API key in the Authorization header. Would you like me to schedule a call with our technical team?',
  '#4823': 'Thank you for the feature request! I\'ve logged this in our product roadmap. The team reviews all requests weekly. Based on similar requests, this feature has a high likelihood of being prioritized in Q3.',
  '#4824': 'Great news! I can process your account upgrade right away. You\'re currently on the Pro plan. Upgrading to Enterprise will give you access to all 6 AI employees with unlimited automations. Shall I process this for you?',
  '#4825': 'I apologize for the dashboard issue. I\'ve identified the bug — it\'s related to a caching issue on the metrics page. Our engineering team has been notified and a fix is expected within 2 hours. I\'ll send you a notification when it\'s resolved.',
};

export default function GuardianWorkspace() {
  const { addActivity, workforcePaused, emergencyStop } = useOS();
  const [tickets, setTickets] = useState(TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [generatingReply, setGeneratingReply] = useState(false);
  const [satisfaction, setSatisfaction] = useState(94);
  const [resolving, setResolving] = useState(false);
  const [liveChat] = useState<{ sender: string; text: string }[]>([
    { sender: 'customer', text: 'Hi, I have a question about my invoice' },
    { sender: 'ai', text: 'Hello! I\'d be happy to help with your invoice. Could you share the invoice number?' },
    { sender: 'customer', text: 'It\'s INV-2024-0847' },
    { sender: 'ai', text: 'I can see invoice INV-2024-0847 for ₹2,400. There appears to be a billing discrepancy. I\'ve corrected it and applied a credit of ₹240 to your account.' },
  ]);
  const [stats, setStats] = useState({ resolved: 53, avgResponse: 0.8, activeChats: 3, openTickets: 5 });

  const resolveTickets = () => {
    setResolving(true); let count = 0;
    const open = tickets.filter((t) => t.status === 'open');
    open.forEach((ticket, i) => {
      setTimeout(() => {
        setTickets((prev) => prev.map((t) => t.id === ticket.id ? { ...t, status: 'resolved' } : t));
        count++; setSatisfaction((s) => Math.min(100, s + 0.4));
        setStats((st) => ({ ...st, resolved: st.resolved + 1, openTickets: Math.max(0, st.openTickets - 1) }));
        if (i === open.length - 1) { setResolving(false); addActivity('GUARDIAN', 'resolved tickets', `${count} tickets auto-resolved — satisfaction ${Math.min(100, satisfaction + count * 0.4).toFixed(1)}%`); }
      }, i * 500);
    });
  };

  const generateReply = (ticketId: string) => {
    setSelectedTicket(ticketId); setGeneratingReply(true); setReply('');
    const text = AUTO_REPLIES[ticketId] || 'I understand your concern. Let me look into this for you right away.';
    let i = 0;
    const interval = setInterval(() => { setReply(text.slice(0, i)); i += 3; if (i > text.length) { clearInterval(interval); setGeneratingReply(false); } }, 10);
  };

  useEffect(() => {
    if (workforcePaused || emergencyStop) return;
    const interval = setInterval(() => {
      setStats((s) => ({ ...s, avgResponse: Math.max(0.3, Math.min(1.5, s.avgResponse + (Math.random() - 0.5) * 0.08)), activeChats: Math.max(1, Math.min(6, s.activeChats + (Math.random() > 0.5 ? 1 : -1))) }));
    }, 2500);
    return () => clearInterval(interval);
  }, [workforcePaused, emergencyStop]);

  return (
    <WorkspaceShell employeeId="guardian" terminalLines={TERMINAL_LINES}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4" style={{ color: C.hex }} />
              <h3 className="font-display text-sm font-bold text-white">Support Tickets</h3>
            </div>
            <span className="font-mono text-[11px] text-white/40">{tickets.filter((t) => t.status === 'open').length} open</span>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto no-scrollbar">
            {tickets.map((ticket) => (
              <div key={ticket.id} onClick={() => ticket.status === 'open' && generateReply(ticket.id)} className="glass rounded-lg p-2.5 cursor-pointer transition-all" style={{ borderColor: selectedTicket === ticket.id ? `rgba(${C.rgb},0.35)` : 'transparent', opacity: ticket.status === 'resolved' ? 0.4 : 1 }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px]" style={{ color: C.hex }}>{ticket.id}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${ticket.priority === 'high' ? 'bg-red-400' : ticket.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'}`} />
                    {ticket.status === 'resolved' && <CheckCircle2 className="w-3 h-3" style={{ color: C.hex }} />}
                  </div>
                </div>
                <div className="text-[12px] text-white/70 truncate">{ticket.subject}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`font-mono text-[9px] ${ticket.sentiment === 'frustrated' ? 'text-red-400' : ticket.sentiment === 'positive' ? 'text-green-400' : 'text-white/40'}`}>{ticket.sentiment}</span>
                  <span className="font-mono text-[9px] text-white/30">{ticket.status}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={resolveTickets} disabled={resolving} className="w-full mt-4 text-white font-medium text-[13px] py-2.5 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50" style={{ background: `linear-gradient(to right, ${C.hex}, ${C.hex}cc)`, boxShadow: `0 0 16px rgba(${C.rgb},0.25)` }}>
            {resolving ? 'Resolving tickets...' : 'Resolve Tickets'}
          </button>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Live Chat</h3>
            <span className="ml-auto font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● {stats.activeChats} ACTIVE</span>
          </div>
          <div className="flex-1 space-y-2 max-h-44 overflow-y-auto no-scrollbar">
            {liveChat.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 text-[12px] ${msg.sender === 'ai' ? 'text-white/80' : 'glass text-white/60'}`} style={msg.sender === 'ai' ? { background: `linear-gradient(135deg, rgba(${C.rgb},0.12), rgba(${C.rgb},0.02))`, border: `1px solid rgba(${C.rgb},0.2)` } : {}}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          {selectedTicket && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="font-mono text-[10px] mb-1" style={{ color: C.hex }}>Auto-reply for {selectedTicket}:</div>
              {generatingReply ? <pre className="font-mono text-[10px] text-white/70 whitespace-pre-wrap leading-relaxed">{reply}<span className="animate-pulse" style={{ color: C.hex }}>▊</span></pre> : reply ? <pre className="font-mono text-[10px] text-white/70 whitespace-pre-wrap leading-relaxed">{reply}</pre> : null}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Smile className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Customer Satisfaction</h3>
          </div>
          <div className="text-center mb-4">
            <div className="font-display text-3xl font-bold tabular-nums" style={{ color: C.hex }}>{satisfaction.toFixed(1)}%</div>
            <div className="font-mono text-[10px] text-white/40 mt-1">Satisfaction Score</div>
          </div>
          <div className="space-y-2">
            <SentimentBar label="Positive" value={78} color="green" />
            <SentimentBar label="Neutral" value={18} color="yellow" />
            <SentimentBar label="Frustrated" value={4} color="red" />
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
            <Stat icon={CheckCircle2} label="Resolved" value={stats.resolved.toString()} color={C.hex} />
            <Stat icon={Clock} label="Avg Response" value={`${stats.avgResponse.toFixed(1)}s`} color={C.hex} />
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Smile className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Sentiment Trend</h3>
            <span className="ml-auto font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● LIVE</span>
          </div>
          <LiveGraph label="POSITIVE %" height={72} color={C.hex} baseValue={78} volatility={5} updateInterval={800} />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Voice Calls</h3>
          </div>
          <div className="space-y-2">
            {[
              { caller: '+91 98765 43210', duration: '00:34', status: 'active' },
              { caller: '+1 415 555 0192', duration: '02:15', status: 'transcribing' },
              { caller: '+44 20 7946 0958', duration: '04:32', status: 'completed' },
              { caller: '+65 8123 4567', duration: '01:08', status: 'completed' },
            ].map((call, i) => (
              <div key={i} className="glass rounded-lg p-2.5 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${call.status === 'active' ? 'animate-pulse' : call.status === 'transcribing' ? 'bg-yellow-500' : 'bg-white/30'}`} style={call.status === 'active' ? { background: C.hex } : {}} />
                <div className="flex-1">
                  <div className="font-mono text-[10px] text-white/60">{call.caller}</div>
                  <div className="font-mono text-[9px] text-white/30">{call.duration} • {call.status}</div>
                </div>
                {call.status === 'active' && <Phone className="w-3 h-3 animate-pulse" style={{ color: C.hex }} />}
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Knowledge Base</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { name: 'Billing FAQ', articles: 18 }, { name: 'API Docs', articles: 22 },
              { name: 'Setup Guide', articles: 14 }, { name: 'Troubleshooting', articles: 28 },
              { name: 'Integrations', articles: 16 }, { name: 'Best Practices', articles: 12 },
              { name: 'Security', articles: 8 }, { name: 'Compliance', articles: 6 },
            ].map((kb, i) => (
              <div key={kb.name} className="glass rounded-lg p-2.5 hover:glass-strong transition-all" style={{ animation: `fade-in 0.3s ease ${i * 0.05}s both` }}>
                <div className="font-mono text-[10px] text-white/60">{kb.name}</div>
                <div className="font-mono text-[9px] mt-1" style={{ color: C.hex }}>{kb.articles} articles</div>
              </div>
            ))}
          </div>
          <style>{`@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }`}</style>
        </GlassCard>
      </div>
    </WorkspaceShell>
  );
}

function SentimentBar({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = { green: '#00ff88', yellow: '#ffb800', red: '#ff3366' };
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[10px] text-white/40 w-16">{label}</span>
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: colors[color] }} />
      </div>
      <span className="font-mono text-[10px] text-white/50 w-8 text-right tabular-nums">{value}%</span>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: typeof CheckCircle2; label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-lg p-2.5 text-center">
      <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color }} />
      <div className="font-display text-[14px] font-bold tabular-nums" style={{ color }}>{value}</div>
      <div className="font-mono text-[9px] text-white/40">{label}</div>
    </div>
  );
}
