import { CheckCircle, XCircle } from 'lucide-react';

const plans = [
  {
    name: 'Gratuit',
    price: 0,
    commission: '15%',
    contacts: '5/mois',
    description: 'Parfait pour débuter',
    features: [
      { name: 'Profil basique', included: true },
      { name: '5 contacts/mois', included: true },
      { name: 'Commission 15%', included: true },
      { name: 'Statistiques basiques', included: true },
      { name: 'Support standard', included: true },
      { name: 'Contacts illimités', included: false },
      { name: 'Boost de visibilité', included: false },
      { name: 'Statistiques avancées', included: false },
    ],
  },
  {
    name: 'Pro',
    price: 15000,
    commission: '10%',
    contacts: 'Illimités',
    description: 'Pour les professionnels actifs',
    popular: true,
    features: [
      { name: 'Profil complet', included: true },
      { name: 'Contacts illimités', included: true },
      { name: 'Commission 10%', included: true },
      { name: 'Statistiques avancées', included: true },
      { name: 'Support prioritaire', included: true },
      { name: '1 boost/mois', included: true },
      { name: 'Badge Pro', included: true },
      { name: 'Conseiller dédié', included: false },
    ],
  },
  {
    name: 'Expert',
    price: 35000,
    commission: '7%',
    contacts: 'Illimités',
    description: 'Pour les experts confirmés',
    features: [
      { name: 'Profil complet', included: true },
      { name: 'Contacts illimités', included: true },
      { name: 'Commission 7%', included: true },
      { name: 'Statistiques complètes', included: true },
      { name: 'Support 24h', included: true },
      { name: '2 boosts/mois', included: true },
      { name: 'Badge Expert', included: true },
      { name: 'Visibilité prioritaire', included: true },
    ],
  },
  {
    name: 'Elite',
    price: 75000,
    commission: '5%',
    contacts: 'Illimités',
    description: 'Sur invitation',
    features: [
      { name: 'Profil premium', included: true },
      { name: 'Contacts illimités', included: true },
      { name: 'Commission 5%', included: true },
      { name: 'Statistiques complètes', included: true },
      { name: 'Conseiller dédié', included: true },
      { name: 'Boosts illimités', included: true },
      { name: 'Badge Elite', included: true },
      { name: 'Accès anticipé', included: true },
    ],
  },
];

export default function Pricing() {
  return (
    <section className="relative page-bg">
      <div className="container-max section-padding">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-gold tracking-wider uppercase">
            Tarifs
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2">
            Choisissez votre plan
          </h2>
          <p className="text-sec mt-3 max-w-lg mx-auto">
            Des tarifs adaptés à chaque étape de votre développement professionnel
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative card-bg rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? 'border-[#D4A853] shadow-[0_10px_40px_rgba(212,168,83,0.08)]'
                  : 'border-theme hover:border-[var(--gold-dim)]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D4A853] text-[#0A0A0F] text-xs font-bold px-3 py-1 rounded-full">
                  Le plus populaire
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-pri mb-1">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold text-pri">{plan.price.toLocaleString()}</span>
                  <span className="text-sm text-ter">XAF/mois</span>
                </div>
                <p className="text-xs text-ter mt-1">{plan.description}</p>
                <div className="flex justify-center gap-4 mt-3 text-xs">
                  <span className="text-gold">Commission {plan.commission}</span>
                  <span className="text-sec">{plan.contacts}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <div key={feature.name} className="flex items-center gap-2.5">
                    {feature.included ? (
                      <CheckCircle className="w-4 h-4 text-[#2ECC71] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-ter shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-sec' : 'text-ter'}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-2.5 rounded-full text-sm font-medium transition-all ${
                  plan.popular
                    ? 'btn-gold'
                    : 'border border-theme text-sec hover:border-[var(--gold)] hover:text-gold'
                }`}
              >
                {plan.price === 0 ? 'Commencer gratuitement' : plan.name === 'Elite' ? 'Demander une invitation' : `Choisir ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
