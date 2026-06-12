import { useEffect, useRef, useState } from 'react';

const criteria = [
  { name: 'Qualité du travail', weight: 30, color: '#D4A853' },
  { name: 'Ponctualité', weight: 20, color: '#D4A853' },
  { name: 'Communication', weight: 20, color: '#D4A853' },
  { name: 'Rapport qualité/prix', weight: 20, color: '#D4A853' },
  { name: 'Professionnalisme', weight: 10, color: '#D4A853' },
];

function ScoreRing({ 
  value, 
  size = 280, 
  strokeWidth = 8,
  delay = 0 
}: { 
  value: number; 
  size?: number; 
  strokeWidth?: number;
  delay?: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), delay);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? value / 100 : 0) * circumference;

  return (
    <svg ref={ref} width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#D4A853"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
      />
    </svg>
  );
}

function ProgressBar({ 
  name, 
  weight, 
  delay = 0 
}: { 
  name: string; 
  weight: number; 
  delay?: number;
}) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), delay);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-sec">{name}</span>
        <span className="text-gold font-medium">{weight}%</span>
      </div>
      <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#D4A853] to-[#E8C87A] rounded-full transition-all duration-1000 ease-out"
          style={{ width: animated ? `${weight * 3}%` : '0%' }}
        />
      </div>
    </div>
  );
}

export default function ProScore() {
  return (
    <section className="relative page-bg">
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Explanation */}
          <div className="space-y-6">
            <span className="text-sm font-semibold text-gold tracking-wider uppercase">
              Système de notation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-pri">
              Le <span className="gold-text-gradient">Pro Score</span>, votre garantie de qualité
            </h2>
            <p className="text-sec leading-relaxed">
              Le Pro Score est un score composite de 0 à 100 calculé sur 5 critères pondérés. 
              Contrairement à une simple moyenne d'étoiles, il intègre une décote temporelle : 
              les avis récents comptent plus que les anciens. Plus un professionnel a un Pro Score élevé, 
              plus vous pouvez lui faire confiance.
            </p>
            <div className="space-y-1 text-sm text-ter">
              <p>• Pondération temporelle : 0-3 mois (100%), 3-6 mois (80%), 6-12 mois (60%)</p>
              <p>• 5 critères distincts notés de 1 à 5 étoiles</p>
              <p>• Recalculé en temps réel après chaque avis</p>
            </div>

            {/* Progress bars */}
            <div className="space-y-4 pt-4">
              {criteria.map((c, i) => (
                <ProgressBar 
                  key={c.name} 
                  name={c.name} 
                  weight={c.weight} 
                  delay={i * 100}
                />
              ))}
            </div>
          </div>

          {/* Right: Score visualization */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <ScoreRing value={100} size={300} strokeWidth={10} />
              {/* Inner rings for each criteria */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <ScoreRing value={85} size={240} strokeWidth={6} delay={200} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ScoreRing value={90} size={180} strokeWidth={6} delay={400} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ScoreRing value={75} size={120} strokeWidth={6} delay={600} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-5xl font-bold text-pri">100</span>
                <span className="text-xs text-ter mt-1">Pro Score max</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
