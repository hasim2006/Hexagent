import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { voiceAgentWorkspace, speakText } from './voice';

export type View = 'landing' | 'launching' | 'dashboard' | 'workspace';
export type WorkspaceId = 'strategist' | 'hunter' | 'creator' | 'automator' | 'guardian' | 'finance' | null;

export interface ActivityItem {
  id: number;
  agent: string;
  action: string;
  detail: string;
  time: string;
}

interface OSState {
  view: View;
  activeWorkspace: WorkspaceId;
  workforceDeployed: boolean;
  workforcePaused: boolean;
  emergencyStop: boolean;
  activities: ActivityItem[];
  deploy: () => void;
  pauseWorkforce: () => void;
  resumeWorkforce: () => void;
  emergencyStopAll: () => void;
  resetEmergency: () => void;
  openWorkspace: (id: WorkspaceId) => void;
  closeWorkspace: () => void;
  addActivity: (agent: string, action: string, detail: string) => void;
}

const OSContext = createContext<OSState | null>(null);

let activityId = 0;

const SEED_ACTIVITIES: Omit<ActivityItem, 'id'>[] = [
  { agent: 'HUNTER', action: 'found leads', detail: '42 qualified leads identified', time: 'now' },
  { agent: 'CREATOR', action: 'wrote content', detail: 'Instagram carousel published', time: '2s ago' },
  { agent: 'FINANCE', action: 'processed invoices', detail: '₹27,300 in invoices cleared', time: '5s ago' },
  { agent: 'GUARDIAN', action: 'resolved ticket', detail: 'Ticket #4821 closed — satisfaction 5/5', time: '8s ago' },
  { agent: 'STRATEGIST', action: 'updated forecast', detail: 'Revenue projection +18% this week', time: '12s ago' },
  { agent: 'AUTOMATOR', action: 'completed workflow', detail: '327 automations executed today', time: '15s ago' },
];

export function OSProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('landing');
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceId>(null);
  const [workforceDeployed, setWorkforceDeployed] = useState(false);
  const [workforcePaused, setWorkforcePaused] = useState(false);
  const [emergencyStop, setEmergencyStop] = useState(false);
  const [activities, setActivities] = useState<ActivityItem[]>(
    SEED_ACTIVITIES.map((a) => ({ ...a, id: activityId++ })).reverse()
  );

  const addActivity = useCallback((agent: string, action: string, detail: string) => {
    setActivities((prev) => [
      { id: activityId++, agent, action, detail, time: 'now' },
      ...prev.slice(0, 19),
    ]);
  }, []);

  const deploy = useCallback(() => {
    setView('launching');
  }, []);

  const pauseWorkforce = useCallback(() => {
    setWorkforcePaused(true);
    addActivity('SYSTEM', 'paused workforce', 'All AI agents suspended');
  }, [addActivity]);

  const resumeWorkforce = useCallback(() => {
    setWorkforcePaused(false);
    addActivity('SYSTEM', 'resumed workforce', 'All AI agents reactivated');
  }, [addActivity]);

  const emergencyStopAll = useCallback(() => {
    setEmergencyStop(true);
    setWorkforcePaused(true);
    addActivity('SYSTEM', 'EMERGENCY STOP', 'All operations halted immediately');
  }, [addActivity]);

  const resetEmergency = useCallback(() => {
    setEmergencyStop(false);
    setWorkforcePaused(false);
    addActivity('SYSTEM', 'emergency cleared', 'Operations resumed');
  }, [addActivity]);

  const openWorkspace = useCallback((id: WorkspaceId) => {
    setActiveWorkspace(id);
    setView('workspace');
    if (id) {
      voiceAgentWorkspace(id);
    }
  }, []);

  const closeWorkspace = useCallback(() => {
    setActiveWorkspace(null);
    setView('dashboard');
    speakText('Returning to command center.', { chime: 'blip', rate: 1.1 });
  }, []);

  // Auto-advance from launching to dashboard
  useEffect(() => {
    if (view === 'launching') {
      const timer = setTimeout(() => {
        setView('dashboard');
        setWorkforceDeployed(true);
      }, 5500);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // Continuous activity generation when deployed and not paused
  useEffect(() => {
    if (!workforceDeployed || workforcePaused) return;
    const agents = [
      { agent: 'HUNTER', action: 'found leads', details: ['12 qualified leads added', 'Outreach sent to 48 prospects', '2 deals closing today', 'Pipeline updated: ₹4,18,000'] },
      { agent: 'CREATOR', action: 'wrote content', details: ['Instagram carousel published', 'LinkedIn article drafted', 'Blog post generated — 1,200 words', '18 content pieces today'] },
      { agent: 'FINANCE', action: 'processed invoices', details: ['₹27,300 in invoices cleared', 'Cashflow forecast updated', 'Tax estimation recalculated', 'Monthly report generated'] },
      { agent: 'GUARDIAN', action: 'resolved ticket', details: ['Ticket #4821 closed — satisfaction 5/5', 'Live chat resolved in 0.8s', '53 tickets resolved today', 'Sentiment improved to positive'] },
      { agent: 'STRATEGIST', action: 'updated forecast', details: ['Revenue projection +18% this week', 'Risk alert: supply chain volatility', 'Growth strategy generated', 'KPI dashboard synced'] },
      { agent: 'AUTOMATOR', action: 'completed workflow', details: ['327 automations executed', 'API sync completed across 7 services', 'Invoice approval pipeline ran', 'Database backup verified'] },
    ];
    const interval = setInterval(() => {
      const a = agents[Math.floor(Math.random() * agents.length)];
      const d = a.details[Math.floor(Math.random() * a.details.length)];
      addActivity(a.agent, a.action, d);
    }, 3500);
    return () => clearInterval(interval);
  }, [workforceDeployed, workforcePaused, addActivity]);

  return (
    <OSContext.Provider
      value={{
        view,
        activeWorkspace,
        workforceDeployed,
        workforcePaused,
        emergencyStop,
        activities,
        deploy,
        pauseWorkforce,
        resumeWorkforce,
        emergencyStopAll,
        resetEmergency,
        openWorkspace,
        closeWorkspace,
        addActivity,
      }}
    >
      {children}
    </OSContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error('useOS must be used within OSProvider');
  return ctx;
}
