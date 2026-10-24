import { useEffect, useRef } from 'react';

interface NetworkGraphProps {
  className?: string;
  nodeCount?: number;
}

/** Animated network graph with laser connections and traveling data packets. */
export default function NetworkGraph({ className = '', nodeCount = 6 }: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    type Node = { x: number; y: number; r: number; pulse: number; label: string };
    type Packet = { from: number; to: number; progress: number; speed: number };
    let nodes: Node[] = [];
    let packets: Packet[] = [];

    const labels = ['STRATEGIST', 'HUNTER', 'CREATOR', 'AUTOMATOR', 'GUARDIAN', 'FINANCE'];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // arrange nodes in a circle
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.32;
      nodes = Array.from({ length: nodeCount }, (_, i) => {
        const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
        return {
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
          r: 8,
          pulse: Math.random() * Math.PI * 2,
          label: labels[i % labels.length],
        };
      });
      packets = Array.from({ length: 12 }, () => ({
        from: Math.floor(Math.random() * nodeCount),
        to: Math.floor(Math.random() * nodeCount),
        progress: Math.random(),
        speed: 0.3 + Math.random() * 0.4,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          // base line
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          grad.addColorStop(0, 'rgba(255,106,0,0.05)');
          grad.addColorStop(0.5, 'rgba(255,106,0,0.2)');
          grad.addColorStop(1, 'rgba(255,106,0,0.05)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // packets
      for (const p of packets) {
        p.progress += p.speed * 0.016;
        if (p.progress >= 1) {
          p.progress = 0;
          p.from = p.to;
          p.to = Math.floor(Math.random() * nodes.length);
          if (p.to === p.from) p.to = (p.to + 1) % nodes.length;
        }
        const a = nodes[p.from];
        const b = nodes[p.to];
        const px = a.x + (b.x - a.x) * p.progress;
        const py = a.y + (b.y - a.y) * p.progress;
        // glow
        ctx.fillStyle = 'rgba(255,106,0,0.15)';
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();
        // core
        ctx.fillStyle = 'rgba(255,180,100,1)';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes
      for (const n of nodes) {
        n.pulse += 0.05;
        const pulseR = n.r + Math.sin(n.pulse) * 2;
        // outer glow
        ctx.fillStyle = 'rgba(255,106,0,0.1)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseR + 12, 0, Math.PI * 2);
        ctx.fill();
        // ring
        ctx.strokeStyle = 'rgba(255,106,0,0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseR + 4, 0, Math.PI * 2);
        ctx.stroke();
        // core
        ctx.fillStyle = 'rgba(255,106,0,0.9)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseR, 0, Math.PI * 2);
        ctx.fill();
        // inner
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, pulseR * 0.4, 0, Math.PI * 2);
        ctx.fill();
        // label
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, n.x, n.y + pulseR + 20);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [nodeCount]);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
