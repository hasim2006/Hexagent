import Section, { SectionHeading } from '../ui/Section';
import ParticleField from '../visuals/ParticleField';
import { EMPLOYEES } from '../../data/employees';
import { useInView } from '../../hooks';

export default function CommandCenter() {
  const { ref, inView } = useInView(0.15);

  return (
    <Section id="command-center" className="py-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <SectionHeading
          eyebrow="Inside Command Center"
          title="The AI War Room"
          subtitle="Six autonomous AI employees stand around a holographic command table, continuously synchronizing intelligence in real time."
        />

        <div ref={ref} className="relative flex items-center justify-center min-h-[640px]">
          {/* particle backdrop */}
          <div className="absolute inset-0 pointer-events-none">
            <ParticleField density={35} color="#ff6a00" speed={0.2} connect />
          </div>

          {/* central holographic table */}
          <div className={`relative transition-all duration-1000 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            {/* table glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-ember-500/10 blur-3xl" />

            {/* table ring */}
            <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px]">
              {/* outer ring */}
              <div className="absolute inset-0 rounded-full border border-ember-500/20 animate-spin-slow" />
              {/* mid ring */}
              <div className="absolute inset-8 rounded-full border border-ember-500/30 animate-spin-rev" />
              {/* inner ring */}
              <div className="absolute inset-16 rounded-full border-2 border-ember-500/40 animate-spin-slow" style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }} />
              {/* core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-mono text-xs tracking-ultra text-ember-500 mb-2">CORE</div>
                  <div className="font-display text-3xl font-bold text-gradient">AI OS</div>
                  <div className="mt-2 flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse" />
                    <span className="font-mono text-[10px] text-white/50">SYNCED</span>
                  </div>
                </div>
              </div>

              {/* laser connections to employees */}
              {EMPLOYEES.map((emp, i) => {
                const angle = (i / EMPLOYEES.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <LaserConnection key={emp.id} angle={angle} active={inView} delay={i * 0.15} />
                );
              })}

              {/* employee nodes */}
              {EMPLOYEES.map((emp, i) => {
                const angle = (i / EMPLOYEES.length) * Math.PI * 2 - Math.PI / 2;
                const radius = 210;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                return (
                  <EmployeeNode
                    key={emp.id}
                    employee={emp}
                    x={x}
                    y={y}
                    active={inView}
                    delay={i * 0.1}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function LaserConnection({ angle, active, delay }: { angle: number; active: boolean; delay: number }) {
  const x2 = Math.cos(angle) * 200;
  const y2 = Math.sin(angle) * 200;
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
      <line
        x1="50%"
        y1="50%"
        x2={`calc(50% + ${x2}px)`}
        y2={`calc(50% + ${y2}px)`}
        stroke="rgba(255,106,0,0.4)"
        strokeWidth="1"
        strokeDasharray="4 4"
        style={{
          opacity: active ? 1 : 0,
          transition: `opacity 0.5s ease ${delay}s`,
          animation: 'dash-flow 1s linear infinite',
        }}
      />
      <style>{`@keyframes dash-flow { to { stroke-dashoffset: -8; } }`}</style>
    </svg>
  );
}

function EmployeeNode({
  employee,
  x,
  y,
  active,
  delay,
}: {
  employee: typeof EMPLOYEES[0];
  x: number;
  y: number;
  active: boolean;
  delay: number;
}) {
  const Icon = employee.icon;
  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-700"
      style={{
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        opacity: active ? 1 : 0,
        transitionDelay: `${delay}s`,
      }}
    >
      <div className="relative group">
        {/* glow */}
        <div className="absolute -inset-4 rounded-full bg-ember-500/20 blur-xl animate-pulse-glow" />
        {/* avatar */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full glass-strong border border-ember-500/40 flex items-center justify-center animate-float-slow" style={{ animationDelay: `${delay}s` }}>
          <Icon className="w-7 h-7 md:w-8 md:h-8 text-ember-500" />
          {/* orbiting dot */}
          <div className="absolute inset-0 rounded-full border border-ember-500/20 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-ember-500" />
          </div>
        </div>
        {/* label */}
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
          <div className="font-display text-xs font-bold text-white">{employee.name}</div>
          <div className="font-mono text-[9px] text-ember-500">{employee.role}</div>
        </div>
      </div>
    </div>
  );
}
