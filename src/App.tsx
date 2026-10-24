import { OSProvider, useOS } from './os/store';
import Loader from './components/Loader';
import LaunchTransition from './os/LaunchTransition';
import Hero from './components/Hero';
import Headquarters from './components/Headquarters';
import CommandCenter from './components/CommandCenter';
import Employees from './components/Employees';
import LiveNetwork from './components/LiveNetwork';
import ActivityFeed from './components/ActivityFeed';
import Metrics from './components/Metrics';
import FinalCTA from './components/FinalCTA';
import Dashboard from './components/Dashboard';
import StrategistWorkspace from './components/workspaces/StrategistWorkspace';
import HunterWorkspace from './components/workspaces/HunterWorkspace';
import CreatorWorkspace from './components/workspaces/CreatorWorkspace';
import AutomatorWorkspace from './components/workspaces/AutomatorWorkspace';
import GuardianWorkspace from './components/workspaces/GuardianWorkspace';
import FinanceWorkspace from './components/workspaces/FinanceWorkspace';
import CEOBriefing from './components/CEOBriefing';
import VoiceToggle from './components/VoiceToggle';
import { useEffect, useState } from 'react';

function AppContent() {
  const { view, activeWorkspace, deploy } = useOS();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = loaded ? 'auto' : 'hidden';
  }, [loaded]);

  // Workspace view
  if (view === 'workspace' && activeWorkspace) {
    const workspaces: Record<string, React.FC> = {
      strategist: StrategistWorkspace,
      hunter: HunterWorkspace,
      creator: CreatorWorkspace,
      automator: AutomatorWorkspace,
      guardian: GuardianWorkspace,
      finance: FinanceWorkspace,
    };
    const Workspace = workspaces[activeWorkspace];
    if (Workspace) return <>{!loaded && <Loader onComplete={() => setLoaded(true)} />}<Workspace /></>;
  }

  // Dashboard view
  if (view === 'dashboard') {
    return (
      <>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
        <div className="noise" />
        <div className="vignette" />
        <Dashboard />
        <CEOBriefing />
      </>
    );
  }

  // Launching view
  if (view === 'launching') {
    return (
      <>
        {!loaded && <Loader onComplete={() => setLoaded(true)} />}
        <LaunchTransition onComplete={() => {}} />
      </>
    );
  }

  // Landing view
  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      <div className="noise" />
      <div className="vignette" />
      <ScrollProgress />
      <Nav onLaunch={deploy} />
      <main className="relative">
        <Hero onLaunch={deploy} />
        <Headquarters />
        <CommandCenter />
        <Employees />
        <LiveNetwork />
        <ActivityFeed />
        <Metrics />
        <FinalCTA />
      </main>
    </>
  );
}

export default function App() {
  return (
    <OSProvider>
      <AppContent />
    </OSProvider>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrolled / total) * 100);
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 z-[9997] bg-transparent">
      <div className="h-full bg-gradient-to-r from-ember-600 via-ember-500 to-ember-400" style={{ width: `${progress}%`, boxShadow: '0 0 8px rgba(255,106,0,0.6)' }} />
    </div>
  );
}

function Nav({ onLaunch }: { onLaunch: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[9996] transition-all duration-500 ${scrolled ? 'py-2.5 sm:py-3 bg-ink-950/85 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'py-3.5 sm:py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg glass-ember flex items-center justify-center">
            <span className="font-display font-bold text-xs text-ember-500">OS</span>
          </div>
          <span className="font-display font-bold text-xs sm:text-sm text-white">made with Hasim</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-xs text-white/50 uppercase tracking-wider">
          <a href="#headquarters" className="hover:text-ember-500 transition-colors">HQ</a>
          <a href="#command-center" className="hover:text-ember-500 transition-colors">Command</a>
          <a href="#employees" className="hover:text-ember-500 transition-colors">Team</a>
          <a href="#network" className="hover:text-ember-500 transition-colors">Network</a>
          <a href="#metrics" className="hover:text-ember-500 transition-colors">Metrics</a>
        </div>

        {/* Right side: Voice toggle + Launch + Mobile Menu button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <VoiceToggle compact />

          <button
            onClick={onLaunch}
            className="font-mono text-xs text-ember-500 border border-ember-500/40 rounded-full px-3.5 sm:px-4 py-1.5 hover:bg-ember-500/10 transition-colors font-medium shadow-[0_0_12px_rgba(255,106,0,0.15)]"
          >
            Launch OS
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white glass"
            aria-label="Toggle menu"
          >
            <div className="w-4 h-4 flex flex-col justify-around">
              <span className={`block h-0.5 w-full bg-current transition-transform ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block h-0.5 w-full bg-current transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-full bg-current transition-transform ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden mt-2 border-t border-white/10 bg-ink-950/95 backdrop-blur-2xl px-6 py-4 space-y-3 font-mono text-xs uppercase tracking-wider text-white/70 animate-in fade-in slide-in-from-top-2">
          <a href="#headquarters" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-ember-500">HQ Skyscraper</a>
          <a href="#command-center" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-ember-500">Command Center</a>
          <a href="#employees" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-ember-500">AI Employees</a>
          <a href="#network" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-ember-500">Live Network</a>
          <a href="#metrics" onClick={() => setMobileOpen(false)} className="block py-1 hover:text-ember-500">Performance Metrics</a>
        </div>
      )}
    </nav>
  );
}
