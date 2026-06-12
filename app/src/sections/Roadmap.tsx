import { Rocket, Shield, Zap, Brain } from 'lucide-react';

const phases = [
  {
    phase: 'Phase 1',
    title: 'MVP Lancement',
    icon: Rocket,
    status: 'completed',
    items: [
      'Inscription pros & clients',
      'Profils avec Pro Score',
      'Messagerie interne',
      '14 villes, 20 catégories',
      'Système de vérification',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Enrichissement',
    icon: Shield,
    status: 'current',
    items: [
      'Paiement sécurisé (escrow)',
      'Messagerie temps réel',
      'Application mobile',
      'Programme de parrainage',
      'API publique',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Croissance',
    icon: Zap,
    status: 'planned',
    items: [
      'Expansion CEMAC',
      'Services B2B entreprises',
      'IA de matching',
      'Assurance missions',
      'Formation pros',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Maturité',
    icon: Brain,
    status: 'vision',
    items: [
      'Marche pan-africain',
      'Services financiers',
      'Écosystème complet',
      'Franchise locale',
      'Impact social',
    ],
  },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  completed: { bg: 'rgba(46,204,113,0.15)', text: '#2ECC71', label: 'Terminé' },
  current: { bg: 'rgba(212,168,83,0.15)', text: '#D4A853', label: 'En cours' },
  planned: { bg: 'rgba(160,160,184,0.15)', text: '#A0A0B8', label: 'Planifié' },
  vision: { bg: 'rgba(107,107,128,0.15)', text: '#6B6B80', label: 'Vision' },
};

export default function Roadmap() {
  return (
    <section className="relative card-bg">
      <div className="container-max section-padding">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-gold tracking-wider uppercase">
            Notre feuille de route
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2">
            Roadmap
          </h2>
        </div>

        <div className="relative">
          {/* Center line - desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-[var(--gold-dim)]" />

          <div className="space-y-8 lg:space-y-0">
            {phases.map((phase, i) => {
              const status = statusColors[phase.status];
              const isLeft = i % 2 === 0;

              return (
                <div
                  key={phase.phase}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-16 ${
                    i > 0 ? 'lg:mt-8' : ''
                  }`}
                >
                  {/* Content */}
                  <div className={`${isLeft ? 'lg:pr-16' : 'lg:col-start-2 lg:pl-16'}`}>
                    <div className="card-bg border border-theme rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: status.bg }}
                        >
                          <phase.icon className="w-5 h-5" style={{ color: status.text }} />
                        </div>
                        <div>
                          <span className="text-xs font-medium" style={{ color: status.text }}>
                            {phase.phase}
                          </span>
                          <h3 className="text-base font-semibold text-pri">{phase.title}</h3>
                        </div>
                        <span
                          className="ml-auto text-[10px] font-bold px-2 py-1 rounded-full"
                          style={{ backgroundColor: status.bg, color: status.text }}
                        >
                          {status.label}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-sec">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: status.text }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center dot - desktop */}
                  <div className="hidden lg:flex absolute left-1/2 top-6 -translate-x-1/2">
                    <div
                      className="w-4 h-4 rounded-full border-2"
                      style={{ borderColor: status.text, backgroundColor: 'var(--bg-secondary)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
