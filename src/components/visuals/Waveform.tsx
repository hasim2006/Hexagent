import { useEffect, useRef } from 'react';

interface WaveformProps {
  className?: string;
  bars?: number;
  color?: string;
  active?: boolean;
}

/** Animated voice waveform with bars of varying heights. */
export default function Waveform({ className = '', bars = 24, color = '#ff6a00', active = true }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      t += 0.05;
      ctx.clearRect(0, 0, w, h);
      const barWidth = w / bars;
      for (let i = 0; i < bars; i++) {
        const phase = t + i * 0.3;
        const amp = active
          ? (Math.sin(phase) * 0.4 + Math.sin(phase * 2.3) * 0.3 + 0.5) * (h * 0.4)
          : h * 0.05;
        const x = i * barWidth + barWidth * 0.2;
        const barH = Math.max(2, amp);
        const y = (h - barH) / 2;
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, `${color}00`);
        grad.addColorStop(0.5, `${color}cc`);
        grad.addColorStop(1, `${color}00`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, y, barWidth * 0.6, barH);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [bars, color, active]);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
