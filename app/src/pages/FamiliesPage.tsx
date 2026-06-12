import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Calculator, HeartPulse, HardHat, Code, Megaphone, GraduationCap, Building2, Sparkles, Leaf, ChevronRight, Users } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { useReveal } from '@/hooks/useReveal';

const families = [
  { name: 'Juridique & Légal', slug: 'juridique-legal', color: '#6366F1', icon: Scale, count: 45, desc: 'Avocats, notaires, huissiers et experts juridiques pour vous accompagner dans vos démarches.', hasPortfolio: false },
  { name: 'Financier & Comptable', slug: 'financier-comptable', color: '#10B981', icon: Calculator, count: 67, desc: 'Comptables, conseillers fiscaux et auditeurs pour la gestion de vos finances.', hasPortfolio: false },
  { name: 'Médical & Santé', slug: 'medical-sante', color: '#EF4444', icon: HeartPulse, count: 89, desc: 'Médecins, infirmiers, kinésithérapeutes et professionnels de santé.', hasPortfolio: false },
  { name: 'Architecture & BTP', slug: 'architecture-btp', color: '#F59E0B', icon: HardHat, count: 234, desc: 'Architectes, plombiers, électriciens, maçons et artisans du bâtiment.', hasPortfolio: true },
  { name: 'Numérique & Technologie', slug: 'numerique-technologie', color: '#3B82F6', icon: Code, count: 156, desc: 'Développeurs web, designers UX/UI, experts SEO et consultants IT.', hasPortfolio: true },
  { name: 'Communication & Créativité', slug: 'communication-creativite', color: '#EC4899', icon: Megaphone, count: 78, desc: 'Graphistes, rédacteurs, photographes et vidéastes.', hasPortfolio: true },
  { name: 'Éducatif & Formation', slug: 'educatif-formation', color: '#8B5CF6', icon: GraduationCap, count: 56, desc: 'Enseignants, coachs professionnels et formateurs certifiés.', hasPortfolio: false },
  { name: 'Services aux Entreprises', slug: 'services-entreprises', color: '#14B8A6', icon: Building2, count: 92, desc: 'Consultants RH, experts qualité, traducteurs et interprètes.', hasPortfolio: false },
  { name: 'Bien-être & Personne', slug: 'bien-etre-personne', color: '#F97316', icon: Sparkles, count: 187, desc: 'Coaches sportifs, coiffeurs, esthéticiens et professionnels du bien-être.', hasPortfolio: true },
  { name: 'Environnement & Technique', slug: 'environnement-technique', color: '#22C55E', icon: Leaf, count: 73, desc: 'Climatisation, énergies renouvelables, jardinage et espaces verts.', hasPortfolio: true },
];

export default function FamiliesPage() {
  useReveal();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen page-bg">
      <Navigation />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <div className="container-max py-12">
          <div className="reveal text-center max-w-2xl mx-auto">
            <span className="section-label">10 domaines d'expertise</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-pri mt-3">
              Familles de <span className="gold-text-gradient">Services</span>
            </h1>
            <p className="text-sec mt-4 leading-relaxed">
              Chaque domaine regroupe des professionnels vérifiés et qualifiés.
              Certains métiers comme les artisans du bâtiment, les créatifs et le bien-être 
              permettent l'ajout de <strong className="text-pri">photos de réalisations</strong> à leur profil.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="container-max">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {families.map((f, i) => {
              const isOpen = expanded === f.slug;
              return (
                <div
                  key={f.slug}
                  className={`reveal reveal-delay-${Math.min(i + 1, 6)} card-bg card-border rounded-2xl p-6 transition-all duration-300 cursor-pointer`}
                  style={{ '--fam-color': f.color } as any}
                  onClick={() => setExpanded(isOpen ? null : f.slug)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${f.color}40`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ''; }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${f.color}12` }}>
                      <f.icon className="w-6 h-6" style={{ color: f.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-pri">{f.name}</h3>
                        {f.hasPortfolio && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--gold-dim)] text-[var(--gold)]">PHOTOS</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-ter">
                        <Users className="w-3 h-3" />
                        {f.count} professionnels
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-ter shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-sm text-sec leading-relaxed">{f.desc}</p>
                    <Link
                      to={`/trouver?famille=${f.slug}`}
                      className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-[var(--gold)] hover:text-[var(--gold-light)]"
                    >
                      Voir les pros <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Mini barre couleur */}
                  <div className="mt-4 h-1 rounded-full overflow-hidden bg-[var(--border-color)]">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (f.count / 350) * 100)}%`, backgroundColor: f.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info portfolio */}
        <div className="container-max mt-12">
          <div className="reveal card-bg card-border rounded-2xl p-6 flex items-start gap-4 max-w-2xl mx-auto">
            <div className="w-10 h-10 rounded-lg bg-[var(--gold-dim)] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div>
              <h3 className="font-semibold text-pri text-sm">Champs spécialisés par métier</h3>
              <p className="text-sm text-sec mt-1 leading-relaxed">
                Selon votre domaine, vous pouvez enrichir votre profil avec des photos de réalisations 
                (couturier, peintre, menuisier), des liens vers des projets (développeur, designer), 
                ou des certifications (médecin, avocat). Les clients voient exactement ce qui compte pour votre métier.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
