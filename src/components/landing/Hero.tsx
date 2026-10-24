import { useMouse } from '../../hooks';
import CityCanvas from '../visuals/CityCanvas';
import ParticleField from '../visuals/ParticleField';
import MagneticButton from '../ui/MagneticButton';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface HeroProps {
  onLaunch: () => void;
}

export default function Hero({ onLaunch }: HeroProps) {
  const mouse = useMouse();

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center">
      {/* city background */}
      <div className="absolute inset-0">
        <CityCanvas parallax={mouse} />
      </div>

      {/* particle overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleField density={40} color="#ff6a00" speed={0.2} />
      </div>

      {/* gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink-950/40 via-transparent to-ink-950 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-transparent to-ink-950/60 pointer-events-none" />

      {/* floating satellites */}
      <div
        className="absolute top-[15%] left-[10%] w-3 h-3 rounded-full bg-ember-500 ember-glow-sm animate-float-slow"
        style={{ transform: `translate(${mouse.x * 30}px, ${mouse.y * 20}px)` }}
      />
      <div
        className="absolute top-[25%] right-[15%] w-2 h-2 rounded-full bg-ember-400 ember-glow-sm animate-float-med"
        style={{ transform: `translate(${mouse.x * -25}px, ${mouse.y * 15}px)` }}
      />
      <div
        className="absolute bottom-[30%] left-[20%] w-2.5 h-2.5 rounded-full bg-white/60 animate-float-fast"
        style={{ transform: `translate(${mouse.x * 20}px, ${mouse.y * -18}px)` }}
      />

      {/* content */}
      <div
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16 text-center"
        style={{ transform: `translate(${mouse.x * -10}px, ${mouse.y * -6}px)` }}
      >
        {/* badge */}
        <div className="mb-6 sm:mb-8 animate-rise" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <span className="font-mono text-[10px] sm:text-xs tracking-wider sm:tracking-ultra text-ember-500 uppercase border border-ember-500/30 rounded-full px-4 sm:px-5 py-1.5 sm:py-2 bg-ember-500/5 backdrop-blur-sm">
            The World's First Autonomous AI Workforce
          </span>
        </div>

        {/* title */}
        <h1
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gradient animate-rise"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          made with Hasim
          <span className="block text-ember-gradient mt-1 sm:mt-2">OS</span>
        </h1>

        {/* tagline */}
        <p
          className="mt-6 sm:mt-8 text-lg sm:text-2xl md:text-3xl font-light text-white/80 max-w-3xl animate-rise"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          The Future Doesn't Hire.
          <br />
          <span className="text-white">It Deploys AI Employees.</span>
        </p>

        <p
          className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/40 max-w-xl animate-rise"
          style={{ animationDelay: '0.7s', opacity: 0 }}
        >
          Run an entire company with autonomous AI workers.
        </p>

        {/* CTA */}
        <div
          className="mt-8 sm:mt-12 animate-rise"
          style={{ animationDelay: '0.9s', opacity: 0 }}
        >
          <MagneticButton
            onClick={onLaunch}
            className="px-6 sm:px-10 py-3.5 sm:py-5 rounded-full text-base sm:text-lg font-medium shadow-2xl"
          >
            Launch Workforce
            <ArrowRight className="w-5 h-5 ml-1" />
          </MagneticButton>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="font-mono text-xs tracking-widest uppercase">Scroll to Enter</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
