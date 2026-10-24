import { useRef, type ReactNode, type CSSProperties } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  float?: boolean;
  glow?: boolean;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

/** Glassmorphic card with optional mouse-tilt and float animation. */
export default function GlassCard({
  children,
  className = '',
  tilt = false,
  float = false,
  glow = false,
  style,
  onClick,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-3px)`;
    ref.current.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    ref.current.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };

  const handleLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = '';
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={`${tilt ? 'transition-transform duration-300 ease-out' : ''} ${float ? 'animate-float-slow' : ''} ${glow ? 'glow-cyan' : ''} glass rounded-2xl ${className}`}
      style={{
        ...style,
        background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.06), transparent 50%), linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))`,
      }}
    >
      {children}
    </div>
  );
}
