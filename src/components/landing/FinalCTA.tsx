import ParticleField from '../visuals/ParticleField';
import MagneticButton from '../ui/MagneticButton';
import { ArrowRight } from 'lucide-react';
import { useInView } from '../../hooks';

export default function FinalCTA() {
  const { ref, inView } = useInView(0.2);

  return (
    <section className="relative py-40 overflow-hidden">
      {/* particle backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleField density={40} color="#ff6a00" speed={0.2} connect />
      </div>

      {/* gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-ember-500/10 blur-3xl" />

      {/* grid */}
      <div className="absolute inset-0 grid-bg-ember opacity-20 mask-fade-b" />

      <div
        ref={ref}
        className={`relative max-w-4xl mx-auto px-6 text-center transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mb-8">
          <span className="font-mono text-xs tracking-ultra text-ember-500 uppercase border border-ember-500/30 rounded-full px-5 py-2 bg-ember-500/5">
            Deploy Your Workforce
          </span>
        </div>

        <h2 className="font-display text-5xl md:text-7xl font-bold text-gradient mb-6">
          The Future of Work
          <span className="block text-ember-gradient mt-2">Is Autonomous</span>
        </h2>

        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-light">
          Stop hiring. Start deploying. Let AI employees run your entire company —
          sales, marketing, operations, finance, and support — 24/7.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-10 py-5 rounded-full text-lg font-medium">
            Launch Workforce
            <ArrowRight className="w-5 h-5" />
          </MagneticButton>
          <MagneticButton variant="ghost" className="px-10 py-5 rounded-full text-lg font-medium">
            Watch Demo
          </MagneticButton>
        </div>

        {/* footer */}
        <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg glass-ember flex items-center justify-center">
              <span className="font-display font-bold text-xs text-ember-500">OS</span>
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">made with Hasim</div>
              <div className="font-mono text-[10px] text-white/40">The Autonomous AI Workforce</div>
            </div>
          </div>
          <div className="font-mono text-xs text-white/30">
            © 2026 made with Hasim — Built for the future
          </div>
        </div>
      </div>
    </section>
  );
}
