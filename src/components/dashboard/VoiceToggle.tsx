import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { isVoiceEnabled, setVoiceEnabled, subscribeVoice, voiceWelcomeBoss, getTimeGreeting } from '../../os/voice';

export default function VoiceToggle({ compact = false }: { compact?: boolean }) {
  const [enabled, setEnabled] = useState(isVoiceEnabled());
  const [speaking, setSpeaking] = useState(false);
  const [greetingText, setGreetingText] = useState(getTimeGreeting().greeting);

  useEffect(() => {
    setGreetingText(getTimeGreeting().greeting);
    return subscribeVoice((isSpeaking) => setSpeaking(isSpeaking));
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    setVoiceEnabled(next);
    if (next) {
      voiceWelcomeBoss();
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleToggle}
        title={enabled ? 'AI Female Voice Enabled (Click to mute)' : 'AI Voice Muted (Click to enable)'}
        className={`relative flex items-center gap-1.5 sm:gap-2 rounded-xl transition-all duration-300 ${
          compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs'
        } ${
          enabled
            ? 'glass-neon-cyan text-neon-cyan border border-neon-cyan/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]'
            : 'glass text-white/40 hover:text-white/70 border border-white/5'
        }`}
      >
        {enabled ? (
          <Volume2 className="w-3.5 h-3.5 animate-pulse text-neon-cyan" />
        ) : (
          <VolumeX className="w-3.5 h-3.5" />
        )}

        {!compact && (
          <span className="font-mono text-[11px] font-semibold tracking-wider hidden xs:inline">
            {enabled ? 'FEMALE VOICE' : 'VOICE OFF'}
          </span>
        )}

        {/* Live Animated Audio Waves when speaking */}
        {speaking && (
          <div className="flex items-center gap-0.5 ml-0.5">
            <span className="w-0.5 h-2.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-4 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </button>

      {/* Quick Test / Greeting Button */}
      {enabled && (
        <button
          onClick={() => voiceWelcomeBoss()}
          title={`Play: "${greetingText}"`}
          className="p-1.5 rounded-lg glass text-neon-cyan hover:glass-neon-cyan transition-all flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] hidden sm:inline">{greetingText}</span>
        </button>
      )}
    </div>
  );
}
