import {
  Brain,
  Target,
  Megaphone,
  Workflow,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

export type NeonColor = 'cyan' | 'magenta' | 'lime' | 'violet' | 'amber' | 'rose' | 'blue' | 'green';

export interface AIEmployee {
  id: string;
  name: string;
  role: string;
  icon: LucideIcon;
  responsibilities: string[];
  color: string;
  neon: NeonColor;
  hex: string;
  stats: { label: string; value: string }[];
}

export const NEON_COLORS: Record<NeonColor, { hex: string; rgb: string; text: string; glass: string; glow: string; grid: string; gradient: string }> = {
  cyan:    { hex: '#00f0ff', rgb: '0,240,255',   text: 'text-neon-cyan',    glass: 'glass-neon-cyan',    glow: 'glow-cyan',    grid: 'grid-bg-cyan',    gradient: 'text-neon-cyan' },
  magenta: { hex: '#ff00d4', rgb: '255,0,212',   text: 'text-neon-magenta', glass: 'glass-neon-magenta', glow: 'glow-magenta', grid: 'grid-bg-magenta', gradient: 'text-neon-magenta' },
  lime:    { hex: '#a3ff00', rgb: '163,255,0',   text: 'text-neon-lime',    glass: 'glass-neon-lime',    glow: 'glow-lime',    grid: 'grid-bg-cyan',    gradient: 'text-neon-lime' },
  violet:  { hex: '#9d4eff', rgb: '157,78,255',  text: 'text-neon-violet',  glass: 'glass-neon-violet',  glow: 'glow-violet',  grid: 'grid-bg-violet',  gradient: 'text-neon-violet' },
  amber:   { hex: '#ffb800', rgb: '255,184,0',   text: 'text-neon-amber',    glass: 'glass-neon-amber',   glow: 'glow-amber',   grid: 'grid-bg-cyan',    gradient: 'text-neon-amber' },
  rose:    { hex: '#ff3366', rgb: '255,51,102',  text: 'text-neon-rose',    glass: 'glass-neon-rose',    glow: 'glow-rose',    grid: 'grid-bg-magenta', gradient: 'text-neon-rose' },
  blue:    { hex: '#0080ff', rgb: '0,128,255',   text: 'text-neon-blue',     glass: 'glass-neon-blue',    glow: 'glow-blue',    grid: 'grid-bg-cyan',    gradient: 'text-neon-blue' },
  green:   { hex: '#00ff88', rgb: '0,255,136',   text: 'text-neon-green',   glass: 'glass-neon-green',   glow: 'glow-green',   grid: 'grid-bg-cyan',    gradient: 'text-neon-green' },
};

export const EMPLOYEES: AIEmployee[] = [
  {
    id: 'strategist',
    name: 'STRATEGIST',
    role: 'CEO AI',
    icon: Brain,
    responsibilities: ['Business Planning', 'KPI Tracking', 'Revenue Growth', 'Company Decisions'],
    color: '#00f0ff',
    neon: 'cyan',
    hex: '#00f0ff',
    stats: [
      { label: 'Revenue Growth', value: '+18%' },
      { label: 'KPIs Tracked', value: '42' },
      { label: 'Decisions/Day', value: '320' },
    ],
  },
  {
    id: 'hunter',
    name: 'HUNTER',
    role: 'Sales AI',
    icon: Target,
    responsibilities: ['Lead Generation', 'Deal Closing', 'Pipeline Growth', 'CRM Management'],
    color: '#ff3366',
    neon: 'rose',
    hex: '#ff3366',
    stats: [
      { label: 'Deals Closed', value: '23' },
      { label: 'Pipeline', value: '₹4.18L' },
      { label: 'Conversion', value: '28%' },
    ],
  },
  {
    id: 'creator',
    name: 'CREATOR',
    role: 'Marketing AI',
    icon: Megaphone,
    responsibilities: ['Social Media', 'Content Generation', 'Campaign Analytics', 'Brand Strategy'],
    color: '#ff00d4',
    neon: 'magenta',
    hex: '#ff00d4',
    stats: [
      { label: 'Posts/Week', value: '42' },
      { label: 'Reach', value: '48K' },
      { label: 'Engagement', value: '8.4%' },
    ],
  },
  {
    id: 'automator',
    name: 'AUTOMATOR',
    role: 'Operations AI',
    icon: Workflow,
    responsibilities: ['Workflow Automation', 'API Connections', 'Approvals', 'Invoice Processing'],
    color: '#a3ff00',
    neon: 'lime',
    hex: '#a3ff00',
    stats: [
      { label: 'Automations', value: '327' },
      { label: 'Hours Saved', value: '38/wk' },
      { label: 'Accuracy', value: '99.2%' },
    ],
  },
  {
    id: 'guardian',
    name: 'GUARDIAN',
    role: 'Customer Success AI',
    icon: ShieldCheck,
    responsibilities: ['Support Tickets', 'Live Chat', 'Voice Calls', 'Sentiment Analysis'],
    color: '#00ff88',
    neon: 'green',
    hex: '#00ff88',
    stats: [
      { label: 'Resolution Rate', value: '94%' },
      { label: 'Avg Response', value: '0.8s' },
      { label: 'Satisfaction', value: '4.7/5' },
    ],
  },
  {
    id: 'finance',
    name: 'FINANCE',
    role: 'Finance AI',
    icon: TrendingUp,
    responsibilities: ['Cashflow', 'Revenue Forecast', 'Tax Compliance', 'Profit Dashboard'],
    color: '#ffb800',
    neon: 'amber',
    hex: '#ffb800',
    stats: [
      { label: 'Monthly Revenue', value: '₹3.42L' },
      { label: 'Forecast Accuracy', value: '92%' },
      { label: 'Compliance', value: '100%' },
    ],
  },
];
