import Section, { SectionHeading } from '../ui/Section';
import NetworkGraph from '../visuals/NetworkGraph';
import ParticleField from '../visuals/ParticleField';
import { useInView } from '../../hooks';

export default function LiveNetwork() {
  const { ref, inView } = useInView(0.2);

  return (
    <Section id="network" className="py-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <SectionHeading
          eyebrow="Live AI Network"
          title="Intelligence Synchronization"
          subtitle="Every AI employee communicates continuously. Data packets travel through the network, making the company smarter every second."
        />

        <div ref={ref} className="relative glass-strong rounded-3xl overflow-hidden min-h-[500px]">
          {/* particle backdrop */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleField density={25} color="#ff6a00" speed={0.15} />
          </div>

          {/* grid */}
          <div className="absolute inset-0 grid-bg-ember opacity-30" />

          {/* network graph */}
          <div className={`relative h-[500px] transition-opacity duration-1000 ${inView ? 'opacity-100' : 'opacity-0'}`}>
            <NetworkGraph nodeCount={6} />

            {/* corner labels */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-ember-500 animate-pulse" />
              <span className="font-mono text-xs text-white/60 tracking-wider">NETWORK ACTIVE</span>
            </div>
            <div className="absolute top-4 right-4 font-mono text-xs text-white/40">
              <span className="text-ember-500">2,847</span> syncs/sec
            </div>
            <div className="absolute bottom-4 left-4 font-mono text-xs text-white/40">
              LATENCY: <span className="text-ember-500">0.3ms</span>
            </div>
            <div className="absolute bottom-4 right-4 font-mono text-xs text-white/40">
              UPTIME: <span className="text-ember-500">99.99%</span>
            </div>
          </div>

          {/* scanline */}
          <div className="scanline" />
        </div>
      </div>
    </Section>
  );
}
