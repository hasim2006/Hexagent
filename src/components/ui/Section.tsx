import { type ReactNode } from 'react';
import { useInView } from '../../hooks';

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

/** Full-height section with scroll reveal. */
export default function Section({ children, id, className = '' }: SectionProps) {
  const { ref, inView } = useInView(0.1);
  return (
    <section
      id={id}
      ref={ref}
      className={`relative w-full transition-all duration-1000 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      {children}
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: SectionHeadingProps) {
  const { ref, inView } = useInView(0.3);
  return (
    <div
      ref={ref}
      className={`flex flex-col gap-4 mb-16 ${align === 'center' ? 'items-center text-center' : 'items-start text-left'}`}
    >
      {eyebrow && (
        <div
          className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <span className="font-mono text-xs tracking-ultra text-ember-500 uppercase border border-ember-500/30 rounded-full px-4 py-1.5 bg-ember-500/5">
            {eyebrow}
          </span>
        </div>
      )}
      <h2
        className={`font-display text-4xl md:text-6xl font-bold text-gradient transition-all duration-700 delay-100 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-2xl text-lg text-white/50 font-light leading-relaxed transition-all duration-700 delay-200 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
