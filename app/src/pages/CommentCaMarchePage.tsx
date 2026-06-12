import { Search, Users, MessageSquare, ShieldCheck, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { useReveal } from '@/hooks/useReveal';

const steps = [
  { icon: Search, title: 'Décrivez votre besoin', desc: 'Sélectionnez une catégorie (plomberie, électricité, coiffure...) et indiquez votre ville. Notre moteur de recherche analyse vos critères.', color: '#D4A853' },
  { icon: Users, title: 'Comparez les professionnels', desc: 'Parcourez les profils complets avec Pro Score, avis vérifiés, tarifs, disponibilités et photos de réalisations.', color: '#3B82F6' },
  { icon: Calendar, title: 'Vérifiez la disponibilité', desc: 'Chaque pro indique son statut : disponible maintenant, cette semaine, ou occupé. Filtrez par disponibilité.', color: '#2ECC71' },
  { icon: MessageSquare, title: 'Contactez via la messagerie', desc: 'Échangez en toute sécurité via notre messagerie interne. Les coordonnées directes sont détectées et bloquées.', color: '#EC4899' },
  { icon: ShieldCheck, title: 'La mission se réalise', desc: 'Le pro intervient chez vous. Une fois satisfait, clôturez la mission sur la plateforme.', color: '#8B5CF6' },
  { icon: Star, title: 'Déposez un avis', desc: 'Notez 5 critères (qualité, ponctualité, communication, prix, professionnalisme). Votre avis alimente le Pro Score.', color: '#F59E0B' },
];

const clientFaq = [
  { q: 'La plateforme est-elle gratuite ?', a: 'Oui, 100% gratuite pour les clients. Aucun frais caché.' },
  { q: 'Comment savoir si un pro est disponible ?', a: 'Chaque profil affiche un indicateur de disponibilité temps réel : vert (disponible), orange (cette semaine), rouge (occupé).' },
  { q: 'Les pros sont-ils vérifiés ?', a: 'Tous les professionnels passent une vérification d\'identité (CNI/passeport). Certains métiers requièrent des diplômes ou certifications.' },
];

export default function CommentCaMarchePage() {
  useReveal();
  return (
    <div className="min-h-screen page-bg">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container-max py-12">
          <div className="reveal text-center max-w-2xl mx-auto">
            <span className="section-label">Guide</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-pri mt-3">
              Comment ça <span className="gold-text-gradient">marche</span> ?
            </h1>
            <p className="text-sec mt-4">6 étapes simples pour trouver le professionnel idéal.</p>
          </div>
        </div>

        {/* Steps */}
        <div className="container-max max-w-4xl">
          <div className="relative">
            <div className="hidden md:block absolute left-8 top-8 bottom-8 w-px bg-[var(--border-color)]" />
            {steps.map((s, i) => (
              <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 6)} relative flex gap-6 mb-8 last:mb-0`}>
                <div className="hidden md:flex flex-col items-center shrink-0">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg z-10"
                    style={{ backgroundColor: `${s.color}15`, border: `2px solid ${s.color}30` }}>
                    <s.icon className="w-7 h-7" style={{ color: s.color }} />
                  </div>
                  {i < steps.length - 1 && <div className="w-px flex-1 bg-[var(--border-color)]" />}
                </div>
                <div className="card-bg card-border rounded-2xl p-6 flex-1">
                  <div className="flex md:hidden items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                      <s.icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${s.color}15`, color: s.color }}>Étape {i + 1}</span>
                  </div>
                  <div className="hidden md:block mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${s.color}15`, color: s.color }}>Étape {i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-pri">{s.title}</h3>
                  <p className="text-sm text-sec mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini FAQ */}
        <div className="container-max mt-16 max-w-2xl">
          <h2 className="reveal text-xl font-bold text-pri text-center mb-6">Questions fréquentes des clients</h2>
          <div className="space-y-3">
            {clientFaq.map((f, i) => (
              <div key={i} className={`reveal reveal-delay-${i + 1} card-bg card-border rounded-xl p-4`}>
                <h4 className="font-medium text-pri text-sm">{f.q}</h4>
                <p className="text-sm text-sec mt-1">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="reveal text-center mt-6">
            <Link to="/faq" className="btn-outline text-sm inline-flex items-center gap-2">Voir toute la FAQ</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
