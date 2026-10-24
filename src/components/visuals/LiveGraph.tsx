import { useEffect, useRef, useState } from 'react';

interface LiveGraphProps {
  className?: string;
  height?: number;
  color?: string;
  maxPoints?: number;
  updateInterval?: number;
  baseValue?: number;
  volatility?: number;
  label?: string;
  unit?: string;
}

/** Real-time line graph that continuously updates with new data points. */
export default function LiveGraph({
  className = '',
  height = 80,
  color = '#ff6a00',
  maxPoints = 40,
  updateInterval = 800,
  baseValue = 50,
  volatility = 15,
  label,
  unit = '',
}: LiveGraphProps) {
  const [points, setPoints] = useState<number[]>(() =>
    Array.from({ length: maxPoints }, () => baseValue + (Math.random() - 0.5) * volatility)
  );
  const [currentVal, setCurrentVal] = useState(baseValue);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.max(5, Math.min(95, last + (Math.random() - 0.5) * volatility));
        setCurrentVal(next);
        return [...prev.slice(1), next];
      });
    }, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, volatility, maxPoints]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);

    // grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 4; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // area fill
    const stepX = w / (points.length - 1);
    ctx.beginPath();
    ctx.moveTo(0, h);
    points.forEach((p, i) => {
      const x = i * stepX;
      const y = h - (p / 100) * h;
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(w, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, `${color}30`);
    grad.addColorStop(1, `${color}00`);
    ctx.fillStyle = grad;
    ctx.fill();

    // line
    ctx.beginPath();
    points.forEach((p, i) => {
      const x = i * stepX;
      const y = h - (p / 100) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // current point dot
    const lastX = (points.length - 1) * stepX;
    const lastY = h - (currentVal / 100) * h;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `${color}40`;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 6, 0, Math.PI * 2);
    ctx.fill();
  }, [points, currentVal, color]);

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }}>
      {label && (
        <div className="absolute top-1 left-2 z-10 flex items-center gap-2">
          <span className="font-mono text-[9px] text-white/35 uppercase tracking-wider">{label}</span>
          <span className="font-mono text-[9px] tabular-nums" style={{ color }}>{currentVal.toFixed(1)}{unit}</span>
        </div>
      )}
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
