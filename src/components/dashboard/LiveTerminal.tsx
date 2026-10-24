import { useEffect, useRef, useState } from 'react';

interface LiveTerminalProps {
  lines: string[];
  title?: string;
  className?: string;
  height?: string;
}

/** Futuristic command-line terminal that streams lines with typing effect. */
export default function LiveTerminal({ lines, title = 'TERMINAL', className = '', height = 'h-32' }: LiveTerminalProps) {
  const [displayed, setDisplayed] = useState<{ text: string; done: boolean }[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const lineIdx = useRef(0);
  const charIdx = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lineIdx.current >= lines.length) {
      // restart after pause
      const reset = setTimeout(() => {
        lineIdx.current = 0;
        charIdx.current = 0;
        setDisplayed([]);
        setCurrentLine('');
      }, 4000);
      return () => clearTimeout(reset);
    }

    const line = lines[lineIdx.current];
    if (charIdx.current < line.length) {
      const timer = setTimeout(() => {
        setCurrentLine(line.slice(0, charIdx.current + 1));
        charIdx.current++;
      }, 15);
      return () => clearTimeout(timer);
    } else {
      // line done, push to displayed, move to next
      const timer = setTimeout(() => {
        setDisplayed((prev) => [...prev.slice(-8), { text: line, done: true }]);
        setCurrentLine('');
        lineIdx.current++;
        charIdx.current = 0;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentLine, lines, displayed]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayed, currentLine]);

  return (
    <div className={`glass rounded-xl overflow-hidden ${className} ${height} flex flex-col`}>
      {/* terminal header */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/5 bg-ink-950/40">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500/60" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
          <span className="w-2 h-2 rounded-full bg-green-500/60" />
        </div>
        <span className="font-mono text-[9px] text-white/40 tracking-wider">{title}</span>
        <span className="ml-auto font-mono text-[9px] text-neon-cyan">● LIVE</span>
      </div>

      {/* terminal body */}
      <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 space-y-0.5">
        {displayed.map((line, i) => (
          <div key={i} className="font-mono text-[10px] leading-[1.6]">
            <span className="text-neon-cyan">›</span>{' '}
            <span className={line.text.includes('ERROR') || line.text.includes('FAIL') ? 'text-red-400' : line.text.includes('SUCCESS') || line.text.includes('✓') ? 'text-green-400' : 'text-white/60'}>
              {line.text}
            </span>
          </div>
        ))}
        {currentLine && (
          <div className="font-mono text-[10px] leading-[1.6]">
            <span className="text-neon-cyan">›</span>{' '}
            <span className="text-white/60">{currentLine}</span>
            <span className="text-neon-cyan animate-pulse">▊</span>
          </div>
        )}
      </div>
    </div>
  );
}
