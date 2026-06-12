import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'Comment fonctionne Services Pro Cameroon ?',
    answer: 'Services Pro Cameroon est une plateforme qui met en relation des clients avec des professionnels vérifiés au Cameroun. Recherchez un service, comparez les profils et contactez le pro de votre choix via notre messagerie sécurisée.',
  },
  {
    question: 'Les professionnels sont-ils vérifiés ?',
    answer: 'Oui, tous nos professionnels passent par un processus de vérification. Nous vérifions leur identité (CNI ou passeport) et leurs qualifications. Les pros vérifiés portent un badge "Identité vérifiée" sur leur profil.',
  },
  {
    question: 'Comment est calculé le Pro Score ?',
    answer: 'Le Pro Score est un score composite de 0 à 100 calculé sur 5 critères pondérés : qualité du travail (30%), ponctualité (20%), communication (20%), rapport qualité/prix (20%) et professionnalisme (10%). Les avis récents comptent plus que les anciens.',
  },
  {
    question: 'Comment déposer un avis ?',
    answer: 'Vous pouvez déposer un avis après avoir complété une mission avec un professionnel. Le dépôt est possible entre 72 heures et 30 jours après la fin de la mission. Vous notez 5 critères et pouvez laisser un commentaire.',
  },
  {
    question: 'La plateforme est-elle gratuite pour les clients ?',
    answer: 'Oui, l\'inscription et l\'utilisation de la plateforme sont entièrement gratuites pour les clients. Vous pouvez rechercher, comparer et contacter les professionnels sans frais.',
  },
  {
    question: 'Comment devenir professionnel sur la plateforme ?',
    answer: 'Inscrivez-vous en tant que professionnel, complétez votre profil (min. 60%), téléchargez votre pièce d\'identité et attendez la validation sous 24-48h. Vous pourrez ensuite recevoir des demandes de clients.',
  },
  {
    question: 'Quels sont les plans tarifaires ?',
    answer: 'Nous proposons 4 plans : Gratuit (0 FCFA, 15% commission), Pro (15 000 FCFA/mois, 10%), Expert (35 000 FCFA/mois, 7%) et Elite (75 000 FCFA/mois, 5%, sur invitation).',
  },
  {
    question: 'Comment fonctionne la messagerie ?',
    answer: 'Notre messagerie interne permet d\'échanger avec les professionnels. Pour votre sécurité, le partage de coordonnées directes (téléphone, email) est détecté et vous êtes invité à utiliser la messagerie de la plateforme.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative page-bg">
      <div className="container-max section-padding">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left: Title - sticky on desktop */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 lg:self-start">
            <span className="text-sm font-semibold text-gold tracking-wider uppercase">
              FAQ
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-sec text-sm leading-relaxed">
              Retrouvez les réponses aux questions les plus courantes sur Services Pro Cameroon.
            </p>
          </div>

          {/* Right: Accordion */}
          <div className="lg:col-span-3 space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-theme rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <span className="text-sm font-medium text-pri pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-ter shrink-0 transition-transform duration-300 ${
                      openIndex === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? 'max-h-48' : 'max-h-0'
                  }`}
                >
                  <p className="px-4 pb-4 text-sm text-sec leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
