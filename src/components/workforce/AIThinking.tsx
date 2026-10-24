import { useEffect, useRef } from 'react';

interface AIThinkingProps {
  size?: number;
  className?: string;
  active?: boolean;
  color?: string;
}

/** Animated neural network "thinking" visualization with glowing nodes and pulses. */
export default function AIThinking({ size = 120, className = '', active = true, color = '#ff6a00' }: AIThinkingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let raf = 0;
    let t = 0;

    // Parse hex to rgb
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };
    const rgb = hexToRgb(color);

    const layers = [3, 5, 4, 2];
    const nodes: { x: number; y: number; layer: number; idx: number }[] = [];
    const layerSpacing = size * 0.7 / (layers.length - 1);
    const startX = size * 0.15;
    layers.forEach((count, l) => {
      const nodeSpacing = size * 0.6 / (count - 1 || 1);
      for (let i = 0; i < count; i++) {
        nodes.push({ x: startX + l * layerSpacing, y: size * 0.2 + i * nodeSpacing, layer: l, idx: i });
      }
    });

    const connections: { from: number; to: number }[] = [];
    for (let l = 0; l < layers.length - 1; l++) {
      const fromNodes = nodes.filter((n) => n.layer === l);
      const toNodes = nodes.filter((n) => n.layer === l + 1);
      fromNodes.forEach((fn) => {
        toNodes.forEach((tn) => {
          connections.push({ from: nodes.indexOf(fn), to: nodes.indexOf(tn) });
        });
      });
    }

    const tick = () => {
      t += 0.02;
      ctx.clearRect(0, 0, size, size);

      connections.forEach((c, i) => {
        const a = nodes[c.from];
        const b = nodes[c.to];
        const pulse = Math.sin(t * 2 + i * 0.3) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${pulse * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        if (active) {
          const tp = (t * 0.5 + i * 0.1) % 1;
          const px = a.x + (b.x - a.x) * tp;
          const py = a.y + (b.y - a.y) * tp;
          ctx.fillStyle = `rgba(${Math.min(255, rgb.r + 50)},${Math.min(255, rgb.g + 50)},${Math.min(255, rgb.b + 50)},${(1 - tp) * 0.6})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      nodes.forEach((n, i) => {
        const pulse = Math.sin(t * 3 + i * 0.5) * 0.5 + 0.5;
        const r = 3 + pulse * 2;
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${pulse * 0.15})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${0.6 + pulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [size, active, color]);

  return <canvas ref={canvasRef} className={className} />;
}
