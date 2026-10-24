import { useEffect, useRef } from 'react';

interface CityCanvasProps {
  className?: string;
  parallax?: { x: number; y: number };
}

/** Cinematic futuristic city skyline rendered on canvas with parallax layers. */
export default function CityCanvas({ className = '', parallax = { x: 0, y: 0 } }: CityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parallaxRef = useRef(parallax);
  parallaxRef.current = parallax;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let t = 0;

    type Building = { x: number; w: number; h: number; layer: number; windows: boolean[]; hue: number };
    let layers: Building[][] = [];
    type Drone = { x: number; y: number; vx: number; layer: number; trail: { x: number; y: number }[] };
    let drones: Drone[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generate();
    };

    const generate = () => {
      layers = [[], [], []];
      for (let l = 0; l < 3; l++) {
        const layerScale = 0.4 + l * 0.3;
        let x = -50;
        while (x < w + 50) {
          const bw = 30 + Math.random() * 80;
          const bh = (60 + Math.random() * 200) * layerScale;
          const winRows = Math.floor(bh / 12);
          const winCols = Math.floor(bw / 8);
          const windows = Array.from({ length: winRows * winCols }, () => Math.random() > 0.4);
          layers[l].push({ x, w: bw, h: bh, layer: l, windows, hue: Math.random() });
          x += bw + 5 + Math.random() * 15;
        }
      }
      drones = Array.from({ length: 8 }, () => ({
        x: Math.random() * w,
        y: h * (0.15 + Math.random() * 0.3),
        vx: (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5),
        layer: Math.floor(Math.random() * 3),
        trail: [],
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const drawBuilding = (b: Building, baseY: number, alpha: number) => {
      const px = parallaxRef.current.x * (b.layer + 1) * 8;
      const py = parallaxRef.current.y * (b.layer + 1) * 4;
      const x = b.x + px;
      const y = baseY - b.h + py;
      // body
      ctx.fillStyle = `rgba(12,12,16,${alpha})`;
      ctx.fillRect(x, y, b.w, b.h);
      // edge glow
      ctx.strokeStyle = `rgba(255,106,0,${0.08 * alpha})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, b.w, b.h);
      // windows
      const winRows = Math.floor(b.h / 12);
      const winCols = Math.floor(b.w / 8);
      for (let r = 0; r < winRows; r++) {
        for (let c = 0; c < winCols; c++) {
          if (!b.windows[r * winCols + c]) continue;
          const flicker = Math.sin(t * 2 + r * 0.5 + c * 0.3) > -0.3;
          if (!flicker) continue;
          const isEmber = (r + c) % 7 === 0;
          ctx.fillStyle = isEmber
            ? `rgba(255,106,0,${0.6 * alpha})`
            : `rgba(180,200,255,${0.25 * alpha})`;
          ctx.fillRect(x + c * 8 + 2, y + r * 12 + 2, 3, 5);
        }
      }
      // top antenna
      if (b.h > 120 && b.layer === 2) {
        ctx.strokeStyle = `rgba(255,106,0,${0.4 * alpha})`;
        ctx.beginPath();
        ctx.moveTo(x + b.w / 2, y);
        ctx.lineTo(x + b.w / 2, y - 20);
        ctx.stroke();
        // blinking light
        if (Math.sin(t * 3) > 0) {
          ctx.fillStyle = `rgba(255,106,0,${0.8 * alpha})`;
          ctx.beginPath();
          ctx.arc(x + b.w / 2, y - 20, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const tick = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      // sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, 'rgba(5,5,8,1)');
      sky.addColorStop(0.5, 'rgba(10,8,14,1)');
      sky.addColorStop(1, 'rgba(20,10,5,1)');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // distant glow
      const glow = ctx.createRadialGradient(w * 0.5, h * 0.7, 0, w * 0.5, h * 0.7, w * 0.6);
      glow.addColorStop(0, 'rgba(255,106,0,0.08)');
      glow.addColorStop(1, 'rgba(255,106,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      // stars
      for (let i = 0; i < 40; i++) {
        const sx = (i * 137.5) % w;
        const sy = (i * 73.3) % (h * 0.4);
        const tw = Math.sin(t * 2 + i) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255,255,255,${tw * 0.3})`;
        ctx.fillRect(sx, sy, 1, 1);
      }

      // buildings back to front
      for (let l = 0; l < 3; l++) {
        const baseY = h * (0.55 + l * 0.12);
        const alpha = 0.4 + l * 0.25;
        for (const b of layers[l]) drawBuilding(b, baseY, alpha);
      }

      // drones
      for (const d of drones) {
        d.x += d.vx;
        if (d.x > w + 20) d.x = -20;
        if (d.x < -20) d.x = w + 20;
        d.trail.push({ x: d.x, y: d.y });
        if (d.trail.length > 15) d.trail.shift();
        const py = parallaxRef.current.y * (d.layer + 1) * 4;
        // trail
        ctx.beginPath();
        for (let i = 0; i < d.trail.length; i++) {
          const tp = d.trail[i];
          if (i === 0) ctx.moveTo(tp.x, tp.y + py);
          else ctx.lineTo(tp.x, tp.y + py);
        }
        ctx.strokeStyle = 'rgba(255,106,0,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        // drone body
        ctx.fillStyle = 'rgba(255,106,0,0.8)';
        ctx.beginPath();
        ctx.arc(d.x, d.y + py, 2, 0, Math.PI * 2);
        ctx.fill();
        // glow
        ctx.fillStyle = 'rgba(255,106,0,0.15)';
        ctx.beginPath();
        ctx.arc(d.x, d.y + py, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // foreground fog
      const fog = ctx.createLinearGradient(0, h * 0.7, 0, h);
      fog.addColorStop(0, 'rgba(5,5,8,0)');
      fog.addColorStop(1, 'rgba(5,5,8,0.9)');
      ctx.fillStyle = fog;
      ctx.fillRect(0, h * 0.7, w, h * 0.3);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
