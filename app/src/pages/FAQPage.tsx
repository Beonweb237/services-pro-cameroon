import { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, CreditCard, MessageSquare, UserCheck, Award, Search } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { useReveal } from '@/hooks/useReveal';

const categories = [
  { key: 'all', label: 'Tout', icon: Search },
  { key: 'general', label: 'Général', icon: HelpCircle },
  { key: 'client', label: 'Client', icon: UserCheck },
  { key: 'pro', label: 'Professionnel', icon: Award },
  { key: 'security', label: 'Sécurité', icon: Shield },
  { key: 'pricing', label: 'Tarifs', icon: CreditCard },
  { key: 'messaging', label: 'Messagerie', icon: MessageSquare },
];

const faqs = [
  { q: 'Comment fonctionne Services Pro Cameroon ?', a: 'Notre plateforme met en relation des clients avec des professionnels vérifiés. Recherchez un service, comparez les profils, vérifiez la disponibilité et contactez le pro via notre messagerie sécurisée.', cat: 'general' },
  { q: 'Les professionnels sont-ils vérifiés ?', a: 'Oui, tous passent une vérification d\'identité (CNI/passeport). Certains métiers requièrent des diplômes vérifiés (avocat, médecin, comptable).', cat: 'security' },
  { q: 'Comment est calculé le Pro Score ?', a: 'C\'est un score composite 0-100 basé sur 5 critères pondérés : qualité (30%), ponctualité (20%), communication (20%), rapport qualité/prix (20%), professionnalisme (10%). Les avis récents comptent plus.', cat: 'general' },
  { q: 'Comment déposer un avis ?', a: 'Après une mission complétée, vous avez entre 72h et 30 jours pour noter 5 critères et laisser un commentaire. Un avis par mission maximum.', cat: 'client' },
  { q: 'La plateforme est-elle gratuite pour les clients ?', a: 'Oui, 100% gratuite. Aucun frais pour rechercher, comparer et contacter des professionnels.', cat: 'client' },
  { q: 'Comment devenir professionnel ?', a: 'Inscrivez-vous, complétez votre profil à 60% minimum, téléchargez votre pièce d\'identité et attendez la validation sous 24-48h.', cat: 'pro' },
  { q: 'Quels sont les plans tarifaires ?', a: '4 plans : Gratuit (0 FCFA, 15%), Pro (15 000 FCFA, 10%), Expert (35 000 FCFA, 7%), Elite (75 000 FCFA, 5%, sur invitation).', cat: 'pricing' },
  { q: 'La messagerie est-elle sécurisée ?', a: 'Oui, tous les échanges sont chiffrés. Le partage de coordonnées directes est détecté automatiquement pour votre protection.', cat: 'messaging' },
  { q: 'Comment fonctionne le filtre de disponibilité ?', a: 'Les pros peuvent indiquer leur statut : disponible (vert), cette semaine (orange) ou occupé (rouge). Vous pouvez filtrer les résultats par disponibilité.', cat: 'general' },
  { q: 'Puis-je ajouter des photos à mon profil ?', a: 'Selon votre métier, oui ! Les artisans du bâtiment, créatifs, coiffeurs et bien-être peuvent ajouter des photos de réalisations. Les médecins et juristes n\'en ont pas besoin.', cat: 'pro' },
  { q: 'Comment signaler un problème ?', a: 'Utilisez le bouton "Signaler" sur n\'importe quel profil ou avis. Notre équipe de modération traite sous 24h.', cat: 'security' },
  { q: 'Quels moyens de paiement sont acceptés ?', a: 'Mobile Money (Orange Money, MTN MoMo, Wave), virement bancaire et carte bancaire (Phase 2).', cat: 'pricing' },
];

export default function FAQPage() {
  useReveal();
  const [open, setOpen] = useState<number | null>(0);
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = faqs.filter(f => {
    const matchCat = activeCat === 'all' || f.cat === activeCat;
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen page-bg">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container-max py-12">
          <div className="reveal text-center max-w-2xl mx-auto">
            <span className="section-label">Centre d'aide</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-pri mt-3">
              Questions <span className="gold-text-gradient">fréquentes</span>
            </h1>
          </div>
        </div>

        {/* Search */}
        <div className="container-max mb-6 max-w-lg">
          <div className="reveal reveal-delay-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ter" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une question..."
              className="w-full input-bg card-border rounded-xl pl-11 pr-4 py-3 text-sm text-pri placeholder-[var(--text-muted)] outline-none focus:border-[var(--gold)] transition-all" />
          </div>
        </div>

        {/* Categories */}
        <div className="container-max mb-8">
          <div className="reveal reveal-delay-1 flex flex-wrap gap-2 justify-center">
            {categories.map((c) => (
              <button key={c.key} onClick={() => setActiveCat(c.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all ${activeCat === c.key ? 'bg-[var(--gold)] text-[#0A0A0F] font-medium' : 'card-bg card-border text-sec hover:text-pri'}`}>
                <c.icon className="w-3.5 h-3.5" />{c.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="container-max max-w-3xl">
          <div className="space-y-2">
            {filtered.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className={`reveal reveal-delay-${Math.min(i % 6 + 1, 6)} card-bg card-border rounded-xl overflow-hidden transition-all ${isOpen ? 'border-[var(--gold)]/20' : ''}`}>
                  <button onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-hover)]/30 transition-colors">
                    <span className="text-sm font-medium text-pri pr-4">{f.q}</span>
                    <ChevronDown className={`w-5 h-5 text-ter shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-60' : 'max-h-0'}`}>
                    <p className="px-4 pb-4 text-sm text-sec leading-relaxed">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-ter">Aucune question ne correspond à votre recherche.</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
