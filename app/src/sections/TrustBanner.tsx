import { ShieldCheck, Clock, Lock, Headphones, TrendingUp, Award } from 'lucide-react';

const pillars = [
  { icon: ShieldCheck, title: 'Pros Vérifiés', description: 'Identité et qualifications contrôlées' },
  { icon: Clock, title: 'Réponse sous 24h', description: 'Engagement de réactivité garanti' },
  { icon: Lock, title: 'Messagerie Sécurisée', description: 'Échanges protégés sur la plateforme' },
  { icon: Headphones, title: 'Support 24/7', description: 'Équipe disponible pour vous aider' },
  { icon: TrendingUp, title: 'Croissance +300%', description: 'Communauté en pleine expansion' },
  { icon: Award, title: 'Excellence Récompensée', description: 'Système Pro Score transparent' },
];

export default function TrustBanner() {
  return (
    <section className="relative border-y" style={{ backgroundColor: 'var(--gold-dim)', borderColor: 'var(--gold-dim)' }}>
      <div className="container-max py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className={`reveal reveal-delay-${Math.min(i + 1, 6)} flex flex-col items-center text-center group`}
            >
              <div className="w-12 h-12 rounded-xl bg-gold-dim flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-gold-dim group-hover:scale-110">
                <pillar.icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="text-sm font-semibold text-pri mb-0.5">{pillar.title}</h3>
              <p className="text-[11px] text-ter leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
