import { useState, useEffect } from 'react';
import WorkspaceShell from './WorkspaceShell';
import GlassCard from '../ui/GlassCard';
import LiveGraph from '../visuals/LiveGraph';
import { useOS } from '../../os/store';
import { NEON_COLORS } from '../../data/employees';
import { Instagram, Linkedin, Youtube, FileText, Image, Hash, Calendar, TrendingUp, Eye, Heart } from 'lucide-react';

const C = NEON_COLORS.magenta;
const TERMINAL_LINES = [
  'CREATOR AI booting...',
  'Loading content generation models...',
  'Connecting to social APIs: Instagram, LinkedIn, X, YouTube...',
  'Trending topics analysis: 24 hashtags tracked',
  'Content calendar: 42 posts scheduled this week',
  'Instagram carousel generated: 5 slides ✓',
  'LinkedIn article drafted: 1,200 words ✓',
  'Blog post generated: SEO optimized ✓',
  'YouTube script outlined: 8 minutes ✓',
  'Caption pack: 12 variations generated ✓',
  'Hashtag analysis: #AIWorkforce trending +18%',
  'Engagement rate: 8.4% (above industry avg)',
  'Reach: 48,200 impressions this week',
  'A/B test: carousel v2 outperforming v1 by 12%',
  'Content published: Instagram carousel live ✓',
  'Auto-scheduling next 7 days of content...',
  'Brand voice consistency: 96.4% match',
  'CREATOR: all systems nominal',
];

const CONTENT_TYPES = [
  { id: 'instagram', label: 'Instagram Carousel', icon: Instagram, color: '#ff00d4' },
  { id: 'linkedin', label: 'LinkedIn Article', icon: Linkedin, color: '#0080ff' },
  { id: 'blog', label: 'Blog Post', icon: FileText, color: '#00ff88' },
  { id: 'video', label: 'Video Script', icon: Youtube, color: '#ff3366' },
  { id: 'caption', label: 'Caption Pack', icon: Hash, color: '#a3ff00' },
  { id: 'carousel', label: 'Carousel Design', icon: Image, color: '#9d4eff' },
];

const TRENDS = ['#AIWorkforce', '#Automation', '#FutureOfWork', '#AIAgents', '#NoCodeAI', '#BusinessAutomation', '#AutonomousAI', '#TechInnovation', '#DigitalTransformation', '#AIRevolution'];

const SAMPLE_CONTENT: Record<string, string> = {
  instagram: `CAROUSEL: 5 Ways AI Employees Transform Your Business

Slide 1: The Future Doesn't Hire — It Deploys
Slide 2: 24/7 Autonomous Operations
Slide 3: 99.2% Automation Accuracy
Slide 4: ₹3.4L Monthly Revenue Managed
Slide 5: Start Your AI Workforce Today

CTA: Launch your AI workforce at made with Hasim`,
  linkedin: `How AI Employees Are Replacing Traditional Hiring

The workplace is undergoing its biggest transformation since the internet. Companies are no longer hiring humans — they're deploying AI employees.

At made with Hasim, our 6 autonomous AI agents handle sales, marketing, operations, finance, and customer support — 24/7, without breaks.

The result? 1,280+ tasks completed, 99.2% accuracy, and ₹3.4L in monthly revenue managed.

The future of work isn't remote. It's autonomous.`,
  blog: `The Autonomous Company: How AI Workforces Are Redefining Business

In 2026, the most successful companies don't have HR departments. They have AI deployment strategies.

This 1,200-word deep dive explores how autonomous AI employees are transforming every department...`,
  video: `[SCENE 1: Aerial shot of futuristic city]
VO: What if your entire company ran itself?

[SCENE 2: AI command center]
VO: Six AI employees. One mission. Total automation.

[SCENE 3: Dashboard with live metrics]
VO: ₹3.4L managed. 1,280 tasks completed. Zero human intervention.

[CTA: Launch your AI workforce today]`,
  caption: `The future doesn't hire. It deploys.

6 AI employees. 1 autonomous company. Zero limits.

#AIWorkforce #FutureOfWork #Automation #AIAgents

Launch yours at made with Hasim →`,
  carousel: `DESIGN BRIEF: Carousel — "The Autonomous Company"

Frame 1: Dark premium background, magenta accent
Frame 2: Glass card with "6 AI Employees" stat
Frame 3: Revenue chart animation
Frame 4: Network graph visualization
Frame 5: CTA with magnetic button

Style: Glassmorphism, neon magenta, cinematic depth`,
};

export default function CreatorWorkspace() {
  const { addActivity, workforcePaused, emergencyStop } = useOS();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<{ type: string; content: string }[]>([]);
  const [activeTab, setActiveTab] = useState('instagram');
  const [analytics, setAnalytics] = useState({ reach: 48.2, engagement: 8.4, posts: 42, followers: 3200 });

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerated(CONTENT_TYPES.map((c) => ({ type: c.id, content: SAMPLE_CONTENT[c.id] })));
      setGenerating(false);
      setAnalytics((a) => ({ ...a, posts: a.posts + 6 }));
      addActivity('CREATOR', 'wrote content', '18 content pieces generated today');
    }, 2500);
  };

  const activeContent = generated.find((g) => g.type === activeTab);

  useEffect(() => {
    if (workforcePaused || emergencyStop) return;
    const interval = setInterval(() => {
      setAnalytics((a) => ({ reach: a.reach + Math.random() * 0.05, engagement: Math.max(6, Math.min(12, a.engagement + (Math.random() - 0.5) * 0.08)), posts: a.posts, followers: a.followers + (Math.random() > 0.7 ? 1 : 0) }));
    }, 2500);
    return () => clearInterval(interval);
  }, [workforcePaused, emergencyStop]);

  return (
    <WorkspaceShell employeeId="creator" terminalLines={TERMINAL_LINES}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Content Planner</h3>
          </div>
          <div className="space-y-2">
            {CONTENT_TYPES.map((c) => {
              const Icon = c.icon;
              const done = generated.some((g) => g.type === c.id);
              return (
                <div key={c.id} className="glass rounded-lg p-2.5 flex items-center gap-3 transition-all cursor-pointer" style={{ borderColor: activeTab === c.id ? `rgba(${C.rgb},0.35)` : done ? `rgba(${C.rgb},0.2)` : 'transparent' }} onClick={() => setActiveTab(c.id)}>
                  <Icon className="w-4 h-4" style={{ color: c.color }} />
                  <span className="text-[12px] text-white/70 flex-1">{c.label}</span>
                  {done && <span className="text-[10px] font-mono" style={{ color: C.hex }}>✓</span>}
                </div>
              );
            })}
          </div>
          <button onClick={generate} disabled={generating} className="w-full mt-4 text-white font-medium text-[13px] py-2.5 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50" style={{ background: `linear-gradient(to right, ${C.hex}, ${C.hex}cc)`, boxShadow: `0 0 16px rgba(${C.rgb},0.25)` }}>
            {generating ? 'Generating content...' : "Generate Today's Content"}
          </button>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-bold text-white">Preview Window</h3>
            {generating ? <span className="font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>GENERATING...</span> : <span className="font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● LIVE</span>}
          </div>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <AnalyticsStat icon={Eye} label="Reach" value={`${analytics.reach.toFixed(1)}K`} color={C.hex} />
            <AnalyticsStat icon={Heart} label="Engagement" value={`${analytics.engagement.toFixed(1)}%`} color={C.hex} />
            <AnalyticsStat icon={FileText} label="Posts" value={analytics.posts.toString()} color={C.hex} />
            <AnalyticsStat icon={TrendingUp} label="Followers" value={analytics.followers.toLocaleString('en-IN')} color={C.hex} />
          </div>
          {activeContent ? (
            <div className="flex-1 glass rounded-lg p-4 max-h-56 overflow-y-auto no-scrollbar" style={{ animation: 'fade-in 0.4s ease' }}>
              <pre className="font-mono text-[11px] text-white/70 whitespace-pre-wrap leading-relaxed">{activeContent.content}</pre>
            </div>
          ) : generating ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="space-y-2 w-full">
                {[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-3 bg-white/5 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s`, width: `${60 + Math.random() * 40}%` }} />)}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-white/30 font-mono text-xs">Click "Generate Today's Content" to preview</div>
          )}
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Engagement Rate</h3>
            <span className="ml-auto font-mono text-[10px] animate-pulse" style={{ color: C.hex }}>● LIVE</span>
          </div>
          <LiveGraph label="ENGAGEMENT" unit="%" height={72} color={C.hex} baseValue={64} volatility={6} updateInterval={700} />
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Trending Topics</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRENDS.map((t, i) => (
              <span key={t} className="rounded-full px-3 py-1.5 font-mono text-[10px] cursor-pointer transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, rgba(${C.rgb},0.1), rgba(${C.rgb},0.02))`, border: `1px solid rgba(${C.rgb},0.2)`, color: C.hex, animation: `fade-in 0.3s ease ${i * 0.05}s both` }}>{t}</span>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4" style={{ color: C.hex }} />
            <h3 className="font-display text-sm font-bold text-white">Content Calendar — This Week</h3>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="glass rounded-lg p-2 text-center">
                <div className="font-mono text-[9px] text-white/40 mb-2">{day}</div>
                <div className="space-y-1">
                  {['IG', 'in', 'Blog'].slice(0, (i % 3) + 1).map((p, j) => (
                    <div key={j} className="rounded text-[8px] font-mono py-1" style={{ background: `rgba(${C.rgb},0.1)`, color: C.hex }}>{p}</div>
                  ))}
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

function AnalyticsStat({ icon: Icon, label, value, color }: { icon: typeof Eye; label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-lg p-2.5 text-center">
      <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color }} />
      <div className="font-display text-[14px] font-bold tabular-nums" style={{ color }}>{value}</div>
      <div className="font-mono text-[9px] text-white/40">{label}</div>
    </div>
  );
}
