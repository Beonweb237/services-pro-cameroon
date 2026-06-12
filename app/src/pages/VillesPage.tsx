import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Search } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { useReveal } from '@/hooks/useReveal';

const cities = [
  { id: '1', name: 'Douala', region: 'Littoral', population: '4,5M', pros: 1240, categories: 18, phase: 1, color: '#3B82F6', top: ['Plomberie', 'Électricité', 'Coiffure'] },
  { id: '2', name: 'Yaoundé', region: 'Centre', population: '4M', pros: 890, categories: 18, phase: 1, color: '#10B981', top: ['Avocat', 'Électricité', 'Développeur'] },
  { id: '3', name: 'Bafoussam', region: 'Ouest', population: '400K', pros: 270, categories: 15, phase: 1, color: '#F59E0B', top: ['Menuiserie', 'Maçonnerie', 'Coiffure'] },
  { id: '4', name: 'Garoua', region: 'Nord', population: '500K', pros: 145, categories: 12, phase: 2, color: '#EF4444', top: ['Plomberie', 'Maçonnerie', 'Climatisation'] },
  { id: '5', name: 'Bamenda', region: 'Nord-Ouest', population: '500K', pros: 189, categories: 14, phase: 2, color: '#8B5CF6', top: ['Électricité', 'Informatique', 'Coiffure'] },
  { id: '6', name: 'Ngaoundéré', region: 'Adamaoua', population: '300K', pros: 98, categories: 10, phase: 2, color: '#F97316', top: ['Plomberie', 'Menuiserie', 'Jardinage'] },
  { id: '7', name: 'Maroua', region: 'Extrême-Nord', population: '450K', pros: 134, categories: 11, phase: 2, color: '#14B8A6', top: ['Électricité', 'Maçonnerie', 'Peinture'] },
  { id: '8', name: 'Bertoua', region: 'Est', population: '250K', pros: 87, categories: 10, phase: 2, color: '#EC4899', top: ['Plomberie', 'Menuiserie', 'Nettoyage'] },
  { id: '9', name: 'Ebolowa', region: 'Sud', population: '150K', pros: 56, categories: 9, phase: 3, color: '#22C55E', top: ['Électricité', 'Coiffure', 'Cuisine'] },
  { id: '10', name: 'Buea', region: 'Sud-Ouest', population: '300K', pros: 167, categories: 13, phase: 3, color: '#6366F1', top: ['Développeur', 'Design', 'Photographie'] },
  { id: '11', name: 'Kribi', region: 'Sud', population: '100K', pros: 45, categories: 8, phase: 3, color: '#06B6D4', top: ['Plomberie', 'Climatisation', 'Jardinage'] },
  { id: '12', name: 'Limbe', region: 'Sud-Ouest', population: '200K', pros: 112, categories: 12, phase: 3, color: '#84CC16', top: ['Électricité', 'Menuiserie', 'Peinture'] },
  { id: '13', name: 'Edéa', region: 'Littoral', population: '150K', pros: 78, categories: 9, phase: 3, color: '#A855F7', top: ['Plomberie', 'Maçonnerie', 'Ferronnerie'] },
  { id: '14', name: 'Kumba', region: 'Sud-Ouest', population: '300K', pros: 134, categories: 12, phase: 3, color: '#D946EF', top: ['Électricité', 'Coiffure', 'Couture'] },
];

const phases = [
  { num: 1, label: 'Phase 1', desc: 'Villes actives', cities: cities.filter(c => c.phase === 1) },
  { num: 2, label: 'Phase 2', desc: 'En expansion', cities: cities.filter(c => c.phase === 2) },
  { num: 3, label: 'Phase 3', desc: 'Prochainement', cities: cities.filter(c => c.phase === 3) },
];

export default function VillesPage() {
  useReveal();
  const [search, setSearch] = useState('');
  const [activePhase, setActivePhase] = useState(0);

  const filtered = cities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen page-bg">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container-max py-12">
          <div className="reveal text-center max-w-2xl mx-auto">
            <span className="section-label">14 villes couvertes</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-pri mt-3">
              Partout au <span className="gold-text-gradient">Cameroun</span>
            </h1>
            <p className="text-sec mt-4 leading-relaxed">
              Trouvez un professionnel dans votre ville. Nous couvrons les 10 régions du pays.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="container-max mb-10">
          <div className="reveal reveal-delay-1 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ter" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une ville..."
              className="w-full input-bg card-border rounded-xl pl-11 pr-4 py-3 text-sm text-pri placeholder-[var(--text-muted)] outline-none focus:border-[var(--gold)] transition-all"
            />
          </div>
        </div>

        {/* Phase tabs */}
        <div className="container-max mb-8">
          <div className="reveal reveal-delay-1 flex gap-2 justify-center flex-wrap">
            {phases.map((p, i) => (
              <button
                key={p.num}
                onClick={() => setActivePhase(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activePhase === i
                    ? 'bg-[var(--gold)] text-[#0A0A0F]'
                    : 'card-bg card-border text-sec hover:text-pri'
                }`}
              >
                {p.label} <span className="opacity-60">({p.cities.length})</span>
              </button>
            ))}
          </div>
        </div>

        {/* City grid */}
        <div className="container-max">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(search ? filtered : phases[activePhase].cities).map((city, i) => (
              <Link
                key={city.id}
                to={`/trouver?ville=${city.name}`}
                className={`reveal reveal-delay-${Math.min(i + 1, 6)} card-bg card-border rounded-2xl p-5 group transition-all duration-300 hover:-translate-y-1`}
                style={{ '--city-color': city.color } as any}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${city.color}40`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ''; }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${city.color}12` }}>
                      <MapPin className="w-5 h-5" style={{ color: city.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-pri group-hover:text-[var(--gold)] transition-colors">{city.name}</h3>
                      <p className="text-xs text-ter">{city.region}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ter group-hover:text-[var(--gold)] transition-colors" />
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${city.color}08` }}>
                    <div className="text-sm font-bold" style={{ color: city.color }}>{city.pros}</div>
                    <div className="text-[9px] text-ter">Pros</div>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${city.color}08` }}>
                    <div className="text-sm font-bold" style={{ color: city.color }}>{city.categories}</div>
                    <div className="text-[9px] text-ter">Métiers</div>
                  </div>
                  <div className="text-center p-2 rounded-lg" style={{ backgroundColor: `${city.color}08` }}>
                    <div className="text-sm font-bold" style={{ color: city.color }}>{city.population}</div>
                    <div className="text-[9px] text-ter">Hab.</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {city.top.map((cat) => (
                    <span key={cat} className="px-2 py-0.5 rounded-full text-[10px] bg-[var(--gold-dim)] text-[var(--gold)] font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
