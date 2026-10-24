/**
 * Hexagent Component Registry (Domain-Driven Architecture)
 */

// UI Primitives
export { default as GlassCard } from './ui/GlassCard';
export { default as MagneticButton } from './ui/MagneticButton';
export { default as Loader } from './ui/Loader';
export { default as Section, SectionHeading } from './ui/Section';

// Visuals & Canvases
export { default as CityCanvas } from './visuals/CityCanvas';
export { default as HoloGlobe } from './visuals/HoloGlobe';
export { default as LiveGraph } from './visuals/LiveGraph';
export { default as NetworkGraph } from './visuals/NetworkGraph';
export { default as ParticleField } from './visuals/ParticleField';
export { default as Waveform } from './visuals/Waveform';
export { default as CompanyMap } from './visuals/CompanyMap';

// Landing Domain
export { default as Hero } from './landing/Hero';
export { default as Headquarters } from './landing/Headquarters';
export { default as CommandCenter } from './landing/CommandCenter';
export { default as LiveNetwork } from './landing/LiveNetwork';
export { default as Metrics } from './landing/Metrics';
export { default as FinalCTA } from './landing/FinalCTA';

// Workforce & Agent Persona Domain
export { default as Employees } from './workforce/Employees';
export { default as AIPod } from './workforce/AIPod';
export { default as AIThinking } from './workforce/AIThinking';

// Dashboard & OS Executive Domain
export { default as Dashboard } from './dashboard/Dashboard';
export { default as CEOBriefing } from './dashboard/CEOBriefing';
export { default as MasterCommand } from './dashboard/MasterCommand';
export { default as LiveTerminal } from './dashboard/LiveTerminal';
export { default as ActivityFeed } from './dashboard/ActivityFeed';
export { default as ActivityStream } from './dashboard/ActivityStream';
export { default as VoiceToggle } from './dashboard/VoiceToggle';

// Specialized AI Workspaces Domain
export { default as WorkspaceShell } from './workspaces/WorkspaceShell';
export { default as StrategistWorkspace } from './workspaces/StrategistWorkspace';
export { default as HunterWorkspace } from './workspaces/HunterWorkspace';
export { default as CreatorWorkspace } from './workspaces/CreatorWorkspace';
export { default as AutomatorWorkspace } from './workspaces/AutomatorWorkspace';
export { default as GuardianWorkspace } from './workspaces/GuardianWorkspace';
export { default as FinanceWorkspace } from './workspaces/FinanceWorkspace';
