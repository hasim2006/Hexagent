import { useEffect, useRef } from 'react';

interface GlobeProps {
  className?: string;
  size?: number;
}

/** Rotating wireframe holographic globe with data points. */
export default function HoloGlobe({ className = '', size = 200 }: GlobeProps) {
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
    const r = size * 0.4;
    const cx = size / 2;
    const cy = size / 2;

    // random data points on sphere
    const points = Array.from({ length: 40 }, () => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      return { theta, phi };
    });

    const project = (theta: number, phi: number, rot: number) => {
      const x = Math.sin(phi) * Math.cos(theta + rot);
      const y = Math.sin(phi) * Math.sin(theta + rot);
      const z = Math.cos(phi);
      return { x: cx + x * r, y: cy + y * r, z };
    };

    const tick = () => {
      t += 0.005;
      ctx.clearRect(0, 0, size, size);

      // outer glow
      const glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.5);
      glow.addColorStop(0, 'rgba(255,106,0,0.08)');
      glow.addColorStop(1, 'rgba(255,106,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, size, size);

      // latitude lines
      for (let lat = -80; lat <= 80; lat += 20) {
        const phi = (lat * Math.PI) / 180;
        ctx.beginPath();
        for (let lon = 0; lon <= 360; lon += 4) {
          const theta = (lon * Math.PI) / 180;
          const p = project(theta, phi, t);
          const alpha = (p.z + 1) / 2;
          if (lon === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(255,106,0,${alpha * 0.25})`;
        }
        ctx.stroke();
      }

      // longitude lines
      for (let lon = 0; lon < 360; lon += 30) {
        const theta = (lon * Math.PI) / 180;
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 4) {
          const phi = (lat * Math.PI) / 180;
          const p = project(theta, phi, t);
          if (lat === -90) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
          const alpha = (p.z + 1) / 2;
          ctx.strokeStyle = `rgba(255,106,0,${alpha * 0.25})`;
        }
        ctx.stroke();
      }

      // data points
      for (const pt of points) {
        const p = project(pt.theta, pt.phi, t);
        const alpha = (p.z + 1) / 2;
        if (alpha < 0.2) continue;
        ctx.fillStyle = `rgba(255,180,100,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        // pulse
        const pulse = Math.sin(t * 4 + pt.theta * 5) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255,106,0,${alpha * pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [size]);

  return <canvas ref={canvasRef} className={className} />;
}
