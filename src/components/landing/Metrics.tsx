import Section, { SectionHeading } from '../ui/Section';
import GlassCard from '../ui/GlassCard';
import { useInView, useCountUp } from '../../hooks';
import { TrendingUp, CheckCircle2, Cpu, Users, Workflow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Metric {
  icon: LucideIcon;
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
}

const METRICS: Metric[] = [
  { icon: TrendingUp, value: 12.4, prefix: '₹', suffix: 'Cr', label: 'Revenue Managed', decimals: 1 },
  { icon: CheckCircle2, value: 48000, suffix: '+', label: 'Tasks Completed' },
  { icon: Cpu, value: 99.9, suffix: '%', label: 'Automation Accuracy', decimals: 1 },
  { icon: Users, value: 6, label: 'AI Employees Active' },
  { icon: Workflow, value: 247, label: 'Automations Running' },
];

export default function Metrics() {
  const { ref, inView } = useInView(0.3);

  return (
    <Section id="metrics" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          eyebrow="By The Numbers"
          title="Autonomous Impact"
          subtitle="Real results, delivered by AI — around the clock, without breaks."
        />

        <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {METRICS.map((m, i) => (
            <MetricCard key={m.label} metric={m} active={inView} delay={i * 100} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function MetricCard({ metric, active, delay }: { metric: Metric; active: boolean; delay: number }) {
  const Icon = metric.icon;
  const value = useCountUp(metric.value, active, 2000);
  const display = metric.decimals ? value.toFixed(metric.decimals) : Math.floor(value).toLocaleString('en-IN');

  return (
    <div
      className="transition-all duration-700"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <GlassCard className="p-6 h-full" float>
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-ember-500/15 blur-lg" />
            <div className="relative w-12 h-12 rounded-xl glass-ember flex items-center justify-center">
              <Icon className="w-6 h-6 text-ember-500" />
            </div>
          </div>
          <div className="font-display text-3xl md:text-4xl font-bold text-ember-gradient">
            {metric.prefix}{display}{metric.suffix}
          </div>
          <div className="font-mono text-[10px] text-white/50 uppercase tracking-wider">{metric.label}</div>
        </div>
      </GlassCard>
    </div>
  );
}
