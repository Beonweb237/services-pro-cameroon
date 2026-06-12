import { Search, Users, MessageCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Décrivez votre besoin',
    description: 'Choisissez la catégorie de service et indiquez votre ville. Notre système trouve les professionnels disponibles près de chez vous.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Comparez les pros',
    description: 'Consultez les profils détaillés, le Pro Score, les avis vérifiés et les tarifs. Comparez jusqu\'à 3 professionnels.',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Lancez votre mission',
    description: 'Contactez le pro de votre choix via notre messagerie sécurisée. Discutez, planifiez et commencez votre projet.',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative page-bg">
      <div className="container-max section-padding">
        <div className="reveal text-center mb-14">
          <span className="section-label">En 3 étapes</span>
          <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2">
            Comment ça marche ?
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Ligne connectrice - desktop */}
          <div className="hidden lg:block absolute top-16 left-[20%] right-[20%] h-px">
            <div className="w-full h-full border-t-2 border-dashed border-[var(--gold-dim)]" />
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-8 relative">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`reveal reveal-delay-${i + 1} flex flex-col items-center text-center`}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl card-bg border-2 border-[#D4A853] flex items-center justify-center shadow-[0_0_20px_rgba(212,168,83,0.1)]">
                    <step.icon className="w-7 h-7 text-gold" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#D4A853] flex items-center justify-center shadow-lg">
                    <span className="text-xs font-bold text-[#0A0A0F]">{step.number}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-pri mb-2">{step.title}</h3>
                <p className="text-sm text-sec leading-relaxed max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
