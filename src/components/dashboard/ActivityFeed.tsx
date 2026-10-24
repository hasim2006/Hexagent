import { useEffect, useState } from 'react';
import Section, { SectionHeading } from '../ui/Section';
import { CheckCircle2 } from 'lucide-react';

const ACTIVITIES = [
  'Closed ₹14,20,000 Deal',
  'Generated 47 Qualified Leads',
  'Scheduled 132 Meetings',
  'Posted 28 Social Campaigns',
  'Resolved 84 Support Tickets',
  'Saved 216 Human Hours',
  'Processed ₹8,40,000 Invoices',
  'Automated 312 Workflows',
  'Forecast Q3 Revenue +32%',
  'Onboarded 12 New Clients',
  'Optimized 7 Ad Campaigns',
  'Synced 2,847 Data Points',
];

export default function ActivityFeed() {
  const [items, setItems] = useState<{ id: number; text: string }[]>([]);

  useEffect(() => {
    let id = 0;
    const add = () => {
      const text = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
      setItems((prev) => [...prev.slice(-5), { id: id++, text }]);
    };
    // seed
    add();
    add();
    add();
    const interval = setInterval(add, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section id="activity" className="py-32">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeading
          eyebrow="Real-Time Activity"
          title="The Workforce Never Sleeps"
          subtitle="Every second, your AI employees are closing deals, generating content, and running operations."
        />

        <div className="relative glass-strong rounded-2xl p-6 min-h-[360px] overflow-hidden">
          {/* grid bg */}
          <div className="absolute inset-0 grid-bg-ember opacity-20" />

          {/* header */}
          <div className="relative flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-ember-500 animate-pulse" />
              <span className="font-mono text-sm text-white/70 tracking-wider">LIVE FEED</span>
            </div>
            <div className="font-mono text-xs text-white/40">
              {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
          </div>

          {/* feed */}
          <div className="relative space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 glass rounded-xl px-4 py-3"
                style={{
                  animation: 'slide-in 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
                  opacity: 0,
                }}
              >
                <CheckCircle2 className="w-5 h-5 text-ember-500 flex-shrink-0" />
                <span className="text-white/80 text-sm md:text-base">{item.text}</span>
                <span className="ml-auto font-mono text-[10px] text-white/30">just now</span>
              </div>
            ))}
          </div>

          <style>{`@keyframes slide-in { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
        </div>
      </div>
    </Section>
  );
}
