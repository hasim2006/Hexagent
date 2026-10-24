import Section, { SectionHeading } from '../ui/Section';
import ParticleField from '../visuals/ParticleField';
import { useInView } from '../../hooks';

export default function Headquarters() {
  const { ref, inView } = useInView(0.2);

  const floors = Array.from({ length: 12 });

  return (
    <Section id="headquarters" className="py-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <SectionHeading
          eyebrow="AI Headquarters"
          title="made with Hasim HQ"
          subtitle="A self-operating skyscraper where every floor is staffed by autonomous intelligence."
        />

        <div ref={ref} className="relative flex items-center justify-center min-h-[600px]">
          {/* particle backdrop */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleField density={30} color="#ff6a00" speed={0.15} />
          </div>

          {/* the skyscraper */}
          <div
            className={`relative transition-all duration-1000 max-w-[calc(100vw-32px)] w-[300px] sm:w-[320px] h-[500px] sm:h-[560px] ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          >
            {/* building glow */}
            <div className="absolute -inset-10 bg-ember-500/10 blur-3xl rounded-full" />

            {/* building body */}
            <div className="relative w-full h-full glass-strong rounded-2xl overflow-hidden">
              {/* top spire */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-1 h-8 bg-gradient-to-t from-ember-500 to-transparent" />
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-ember-500 ember-glow-sm animate-pulse" />

              {/* HQ sign */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                <div className="font-mono text-[10px] tracking-ultra text-ember-500 bg-ink-950/60 px-3 py-1 rounded border border-ember-500/30 whitespace-nowrap">
                  made with Hasim HQ
                </div>
              </div>

              {/* energy line down the middle */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ember-500/40 to-transparent" />

              {/* floors */}
              <div className="absolute inset-0 pt-16 pb-4 px-3 flex flex-col gap-1.5">
                {floors.map((_, i) => (
                  <Floor key={i} index={i} active={inView} />
                ))}
              </div>

              {/* scanline */}
              <div className="scanline" />

              {/* glass reflection sweep */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
                }}
              />
            </div>

            {/* floating drones around building */}
            <Drone className="top-[20%] -left-12" delay={0} />
            <Drone className="top-[45%] -right-12" delay={1.5} />
            <Drone className="bottom-[15%] -left-8" delay={3} />

            {/* holographic ad floating */}
            <div className="absolute -right-20 top-[30%] glass-ember rounded-lg px-3 py-2 animate-float-med hidden lg:block">
              <div className="font-mono text-[9px] text-ember-500">REVENUE +24%</div>
            </div>
            <div className="absolute -left-24 bottom-[25%] glass rounded-lg px-3 py-2 animate-float-slow hidden lg:block">
              <div className="font-mono text-[9px] text-white/60">6 AI ACTIVE</div>
            </div>
          </div>

          {/* ground reflection */}
          <div
            className="absolute -bottom-10 w-80 h-20 opacity-40"
            style={{
              background: 'linear-gradient(180deg, rgba(255,106,0,0.3), transparent)',
              filter: 'blur(20px)',
            }}
          />
        </div>
      </div>
    </Section>
  );
}

function Floor({ index, active }: { index: number; active: boolean }) {
  const windows = Array.from({ length: 14 });
  return (
    <div className="flex-1 flex gap-1 items-center">
      {windows.map((_, j) => {
        const lit = (index * 7 + j * 3) % 4 !== 0;
        const ember = (index + j) % 5 === 0;
        return (
          <div
            key={j}
            className="flex-1 h-3 rounded-sm transition-all duration-500"
            style={{
              background: lit
                ? ember
                  ? 'rgba(255,106,0,0.7)'
                  : 'rgba(180,200,255,0.25)'
                : 'rgba(255,255,255,0.03)',
              boxShadow: lit && ember ? '0 0 6px rgba(255,106,0,0.5)' : 'none',
              opacity: active ? 1 : 0,
              transitionDelay: `${index * 60 + j * 20}ms`,
            }}
          />
        );
      })}
    </div>
  );
}

function Drone({ className, delay }: { className: string; delay: number }) {
  return (
    <div
      className={`absolute ${className} animate-float-slow`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative">
        <div className="w-2 h-2 rounded-full bg-ember-500 ember-glow-sm" />
        <div className="absolute top-1/2 -translate-y-1/2 left-3 w-12 h-px bg-gradient-to-r from-ember-500 to-transparent" />
      </div>
    </div>
  );
}
