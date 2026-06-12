import { CheckCircle, XCircle, Sparkles, Zap, Crown, Gem } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { useReveal } from '@/hooks/useReveal';

const plans = [
  {
    name: 'Gratuit', icon: Sparkles, price: 0, commission: '15%', contacts: '5/mois', desc: 'Pour tester la plateforme',
    features: [
      { name: 'Profil basique', ok: true }, { name: '5 contacts/mois', ok: true }, { name: 'Commission 15%', ok: true },
      { name: 'Statistiques basiques', ok: true }, { name: 'Support standard', ok: true },
      { name: 'Contacts illimités', ok: false }, { name: 'Boost visibilité', ok: false }, { name: 'Badge vérifié', ok: false },
    ],
  },
  {
    name: 'Pro', icon: Zap, price: 15000, commission: '10%', contacts: 'Illimité', desc: 'Pour les pros actifs', popular: true,
    features: [
      { name: 'Profil complet', ok: true }, { name: 'Contacts illimités', ok: true }, { name: 'Commission 10%', ok: true },
      { name: 'Statistiques avancées', ok: true }, { name: 'Support prioritaire', ok: true },
      { name: '1 boost/mois', ok: true }, { name: 'Badge Pro', ok: true }, { name: 'Conseiller dédié', ok: false },
    ],
  },
  {
    name: 'Expert', icon: Crown, price: 35000, commission: '7%', contacts: 'Illimité', desc: 'Pour les experts confirmés',
    features: [
      { name: 'Profil complet', ok: true }, { name: 'Contacts illimités', ok: true }, { name: 'Commission 7%', ok: true },
      { name: 'Statistiques complètes', ok: true }, { name: 'Support 24h', ok: true },
      { name: '2 boosts/mois', ok: true }, { name: 'Badge Expert', ok: true }, { name: 'Visibilité prioritaire', ok: true },
    ],
  },
  {
    name: 'Elite', icon: Gem, price: 75000, commission: '5%', contacts: 'Illimité', desc: 'Sur invitation', invite: true,
    features: [
      { name: 'Profil premium', ok: true }, { name: 'Contacts illimités', ok: true }, { name: 'Commission 5%', ok: true },
      { name: 'Statistiques complètes', ok: true }, { name: 'Conseiller dédié', ok: true },
      { name: 'Boosts illimités', ok: true }, { name: 'Badge Elite', ok: true }, { name: 'Accès anticipé', ok: true },
    ],
  },
];

export default function TarifsPage() {
  useReveal();
  return (
    <div className="min-h-screen page-bg">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container-max py-12">
          <div className="reveal text-center max-w-2xl mx-auto">
            <span className="section-label">Tarifs</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-pri mt-3">
              Choisissez votre <span className="gold-text-gradient">plan</span>
            </h1>
            <p className="text-sec mt-4">Des tarifs adaptés à chaque étape de votre développement professionnel.</p>
          </div>
        </div>

        <div className="container-max">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.map((plan, i) => (
              <div key={plan.name}
                className={`reveal reveal-delay-${Math.min(i + 1, 6)} relative card-bg card-border rounded-2xl p-6 flex flex-col ${plan.popular ? 'border-[var(--gold)]/40 shadow-[0_0_30px_rgba(212,168,83,0.08)]' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--gold)] text-[#0A0A0F] text-[10px] font-bold px-3 py-1 rounded-full">Le plus populaire</div>
                )}
                {plan.invite && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--elite)] text-pri text-[10px] font-bold px-3 py-1 rounded-full">Sur invitation</div>
                )}

                <div className="text-center mb-5 mt-2">
                  <div className="w-10 h-10 rounded-xl bg-[var(--gold-dim)] flex items-center justify-center mx-auto mb-3">
                    <plan.icon className="w-5 h-5 text-[var(--gold)]" />
                  </div>
                  <h3 className="text-lg font-bold text-pri">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mt-1">
                    <span className="text-3xl font-extrabold text-pri">{plan.price.toLocaleString()}</span>
                    <span className="text-xs text-ter">XAF/mois</span>
                  </div>
                  <p className="text-xs text-ter mt-1">{plan.desc}</p>
                </div>

                <div className="flex justify-center gap-4 mb-4 text-xs">
                  <span className="text-[var(--gold)] font-medium">Commission {plan.commission}</span>
                  <span className="text-ter">{plan.contacts}</span>
                </div>

                <div className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <div key={f.name} className="flex items-center gap-2.5">
                      {f.ok ? <CheckCircle className="w-4 h-4 text-[var(--success)] shrink-0" /> : <XCircle className="w-4 h-4 text-[var(--text-muted)] shrink-0" />}
                      <span className={`text-sm ${f.ok ? 'text-sec' : 'text-[var(--text-muted)]'}`}>{f.name}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-2.5 rounded-full text-sm font-medium transition-all ${plan.popular ? 'btn-gold' : plan.invite ? 'border border-[var(--elite)]/30 text-[var(--elite)] hover:bg-[var(--elite)]/5' : 'btn-outline'}`}>
                  {plan.price === 0 ? 'Commencer gratuit' : plan.invite ? 'Demander invitation' : `Choisir ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
