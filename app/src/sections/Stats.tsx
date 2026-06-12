import { useEffect, useRef, useState } from 'react';
import { Users, Briefcase, Star, MapPin, TrendingUp, Shield } from 'lucide-react';

const stats = [
  { value: 2400, suffix: '+', label: 'Professionnels vérifiés', icon: Users },
  { value: 15000, suffix: '+', label: 'Missions réalisées', icon: Briefcase },
  { value: 4.8, suffix: '/5', label: 'Note moyenne', icon: Star, isDecimal: true },
  { value: 14, suffix: '', label: 'Villes couvertes', icon: MapPin },
  { value: 94, suffix: '%', label: 'Clients satisfaits', icon: TrendingUp },
  { value: 100, suffix: '%', label: 'Plateforme sécurisée', icon: Shield },
];

function AnimatedCounter({ value, suffix, isDecimal = false }: { value: number; suffix: string; isDecimal?: boolean }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      if (isDecimal) {
        setCount(Math.round(eased * value * 10) / 10);
      } else {
        setCount(Math.round(eased * value));
      }
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, value, isDecimal]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-extrabold text-pri tracking-tight">
      {isDecimal ? count.toFixed(1) : count.toLocaleString()}
      <span className="text-gold">{suffix}</span>
    </div>
  );
}

export default function Stats() {
  return (
    <section className="relative card-bg">
      <div className="container-max section-padding">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`reveal reveal-delay-${Math.min(i + 1, 6)} flex flex-col items-center text-center`}
            >
              <div className="w-10 h-10 rounded-xl bg-gold-dim flex items-center justify-center mb-3">
                <stat.icon className="w-5 h-5 text-gold" />
              </div>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} />
              <p className="mt-2 text-xs text-ter">{stat.label}</p>
            </div>
          ))}
        </div>

        <p className="reveal text-center text-[10px] text-muted mt-10">
          * Chiffres prospectifs fin d'année 1
        </p>
      </div>
    </section>
  );
}
