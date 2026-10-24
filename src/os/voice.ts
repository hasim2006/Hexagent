// AI Female Voice Assistant Engine with Time-based Greetings and Cyberpunk FX

type VoiceListener = (speaking: boolean) => void;
const listeners = new Set<VoiceListener>();

let isSpeakingState = false;
let audioCtx: AudioContext | null = null;

function notifyListeners(speaking: boolean) {
  isSpeakingState = speaking;
  listeners.forEach((fn) => fn(speaking));
}

export function subscribeVoice(listener: VoiceListener) {
  listeners.add(listener);
  listener(isSpeakingState);
  return () => {
    listeners.delete(listener);
  };
}

export function isVoiceEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  const saved = localStorage.getItem('hasim_voice_enabled');
  return saved === null ? true : saved === 'true';
}

export function setVoiceEnabled(enabled: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hasim_voice_enabled', enabled ? 'true' : 'false');
    if (!enabled) {
      stopVoice();
    }
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/** Play futuristic cyber chime before speaking */
export function playChime(type: 'welcome' | 'alert' | 'action' | 'blip' = 'action') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'welcome') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.25);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Ignore audio context autoplay limitations
  }
}

/**
 * Prioritize and select the best natural female English voice available on the device
 */
export function getBestFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Recognizable female voice names across Windows, MacOS, iOS, Android & Chrome
  const femaleKeywords = [
    /zira/i,
    /jenny/i,
    /aria/i,
    /samantha/i,
    /victoria/i,
    /karen/i,
    /google uk english female/i,
    /google us english/i, // Google US English is default female in Chromium
    /female/i,
    /moira/i,
    /tessa/i,
    /fiona/i,
    /veena/i,
    /hazel/i,
    /susan/i,
  ];

  for (const pattern of femaleKeywords) {
    const found = voices.find((v) => v.lang.startsWith('en') && pattern.test(v.name));
    if (found) return found;
  }

  // Any English voice with female in URI or name
  const anyFemale = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (/female/i.test(v.name) || /female/i.test(v.voiceURI))
  );
  if (anyFemale) return anyFemale;

  // Fallback to any natural English voice
  const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
  return anyEnglish || voices[0] || null;
}

/**
 * Determine dynamic time-based greeting (Good morning, Good afternoon, Good evening, Good night)
 */
export function getTimeGreeting(): { greeting: string; period: 'morning' | 'afternoon' | 'evening' | 'night' } {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { greeting: 'Good morning, Boss', period: 'morning' };
  } else if (hour >= 12 && hour < 17) {
    return { greeting: 'Good afternoon, Boss', period: 'afternoon' };
  } else if (hour >= 17 && hour < 22) {
    return { greeting: 'Good evening, Boss', period: 'evening' };
  } else {
    return { greeting: 'Good night, Boss', period: 'night' };
  }
}

/** Core Female Speech Function */
export function speakText(
  text: string,
  options?: {
    chime?: 'welcome' | 'alert' | 'action' | 'blip';
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
    interrupt?: boolean;
  }
) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (!isVoiceEnabled()) return;

  // Default female tone: pitch ~ 1.15 - 1.18 gives a clear, pleasant female voice
  const { chime = 'action', rate = 1.03, pitch = 1.15, onEnd, interrupt = true } = options || {};

  if (interrupt) {
    window.speechSynthesis.cancel();
  }

  playChime(chime);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;

  const femaleVoice = getBestFemaleVoice();
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  utterance.onstart = () => {
    notifyListeners(true);
  };

  utterance.onend = () => {
    notifyListeners(false);
    onEnd?.();
  };

  utterance.onerror = () => {
    notifyListeners(false);
    onEnd?.();
  };

  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const v = getBestFemaleVoice();
      if (v) utterance.voice = v;
      window.speechSynthesis.speak(utterance);
    };
  } else {
    window.speechSynthesis.speak(utterance);
  }
}

export function stopVoice() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    notifyListeners(false);
  }
}

// ─── Time-Based & Action Spoken Voices (Female Voice) ─────────────────────────

export function voiceWelcomeBoss() {
  const { greeting, period } = getTimeGreeting();
  let followUp = "Welcome to your command center. All six AI employees are online and standing by.";
  if (period === 'night') {
    followUp = "Command center is active on night watch. All six AI employees are running automated routines.";
  }
  speakText(
    `${greeting}. ${followUp}`,
    { chime: 'welcome', rate: 1.02, pitch: 1.18 }
  );
}

// Alias for backwards compatibility
export const voiceWelcomeHasim = voiceWelcomeBoss;

export function voiceDeployAll() {
  speakText(
    "Deploying all AI workforce. Strategist, Hunter, Creator, Automator, Guardian, and Finance are now operational.",
    { chime: 'action', rate: 1.06, pitch: 1.15 }
  );
}

export function voicePause() {
  speakText("Workforce paused. All AI agents suspended.", { chime: 'blip', rate: 1.08, pitch: 1.15 });
}

export function voiceResume() {
  speakText("Workforce resumed. Agents reactivated.", { chime: 'action', rate: 1.08, pitch: 1.15 });
}

export function voiceEmergencyStop() {
  speakText("Warning: Emergency stop initiated. All operations halted immediately.", {
    chime: 'alert',
    rate: 1.05,
    pitch: 1.1,
  });
}

export function voiceEmergencyReset() {
  speakText("Emergency cleared. Systems restored to nominal operation.", {
    chime: 'action',
    rate: 1.06,
    pitch: 1.15,
  });
}

export function voiceAgentWorkspace(agentId: string) {
  const map: Record<string, string> = {
    strategist: "Strategist AI workspace active. Analyzing business plan and growth projections.",
    hunter: "Hunter AI active. Pipeline scan initialized. Ready to close deals.",
    creator: "Creator AI active. Social content engine online.",
    automator: "Automator AI active. Workflow automations running smoothly.",
    guardian: "Guardian AI active. Customer success queues monitored.",
    finance: "Finance AI active. Cashflow and revenue forecasting loaded.",
  };
  const message = map[agentId] || `${agentId.toUpperCase()} workspace ready.`;
  speakText(message, { chime: 'action', rate: 1.05, pitch: 1.16 });
}

export function voiceReport() {
  speakText("Compiling company performance report. All department metrics updated.", {
    chime: 'action',
    rate: 1.06,
    pitch: 1.15,
  });
}

export function voiceHealth() {
  speakText("System health check complete. Core engines operating at peak efficiency.", {
    chime: 'action',
    rate: 1.06,
    pitch: 1.15,
  });
}
