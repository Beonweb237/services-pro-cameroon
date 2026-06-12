import { useState } from 'react';
import { Search, MapPin, Star, SlidersHorizontal } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const mockPros = [
  { id: '1', name: 'Jean Kouam', title: 'Plombier', city: 'Douala', proScore: 96, reviews: 48, rating: 4.9, priceMin: 5000, priceMax: 25000, avatar: '👨‍🔧', level: 'elite', skills: ['Dépannage', 'Installation', 'Rénovation'] },
  { id: '2', name: 'Marie T.', title: 'Électricienne', city: 'Yaoundé', proScore: 94, reviews: 62, rating: 4.8, priceMin: 8000, priceMax: 35000, avatar: '👩‍🔧', level: 'elite', skills: ['Électricité', 'Domotique', 'Dépannage'] },
  { id: '3', name: 'Paul Biya', title: 'Menuisier', city: 'Bafoussam', proScore: 91, reviews: 35, rating: 4.7, priceMin: 10000, priceMax: 50000, avatar: '👨‍🏭', level: 'expert', skills: ['Menuiserie', 'Placards', 'Portes'] },
  { id: '4', name: 'Sophie A.', title: 'Coiffeuse', city: 'Douala', proScore: 93, reviews: 89, rating: 4.8, priceMin: 3000, priceMax: 15000, avatar: '💇‍♀️', level: 'elite', skills: ['Coiffure', 'Tresses', 'Perruques'] },
  { id: '5', name: 'Eric M.', title: 'Développeur Web', city: 'Buea', proScore: 95, reviews: 27, rating: 4.9, priceMin: 50000, priceMax: 200000, avatar: '👨‍💻', level: 'elite', skills: ['React', 'Node.js', 'Mobile'] },
  { id: '6', name: 'Aline K.', title: 'Avocate', city: 'Yaoundé', proScore: 92, reviews: 41, rating: 4.7, priceMin: 50000, priceMax: 300000, avatar: '👩‍⚖️', level: 'expert', skills: ['Droit des affaires', 'Contrats', 'Conseil'] },
];

const cities = ['Toutes', 'Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda', 'Buea'];
const categories = ['Toutes', 'Plomberie', 'Électricité', 'Coiffure', 'Menuiserie', 'Développement', 'Avocat'];
const sortOptions = [
  { value: 'score', label: 'Pro Score' },
  { value: 'rating', label: 'Note' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Toutes');
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [sortBy, setSortBy] = useState('score');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPros = mockPros.filter((pro) => {
    if (selectedCity !== 'Toutes' && pro.city !== selectedCity) return false;
    if (selectedCategory !== 'Toutes' && pro.title !== selectedCategory) return false;
    if (query) {
      const q = query.toLowerCase();
      return (
        pro.name.toLowerCase().includes(q) ||
        pro.title.toLowerCase().includes(q) ||
        pro.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen page-bg">
      <Navigation />
      
      <main className="pt-20 pb-16">
        {/* Header */}
        <div className="card-bg border-b border-theme py-8">
          <div className="container-max">
            <h1 className="text-2xl font-bold text-pri mb-4">
              Trouver un <span className="gold-text-gradient">professionnel</span>
            </h1>
            
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 card-bg border border-theme rounded-xl px-4 py-2.5">
                <Search className="w-4 h-4 text-ter" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nom, métier, compétence..."
                  className="flex-1 bg-transparent text-sm text-pri placeholder:text-ter outline-none"
                />
              </div>
              <div className="flex items-center gap-2 card-bg border border-theme rounded-xl px-4 py-2.5">
                <MapPin className="w-4 h-4 text-ter" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-sm text-pri outline-none"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 card-bg border border-theme rounded-xl text-sm text-sec hover:text-pri transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtres
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 p-4 card-bg rounded-xl border border-theme">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-xs text-ter mb-1.5">Catégorie</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                            selectedCategory === cat
                              ? 'bg-[#D4A853] text-[#0A0A0F] font-medium'
                              : 'card-bg text-sec border border-theme'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-ter mb-1.5">Trier par</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="card-bg border border-theme rounded-lg px-3 py-1.5 text-xs text-pri outline-none"
                    >
                      {sortOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="container-max py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-sec">
              <span className="text-pri font-medium">{filteredPros.length}</span> professionnel{filteredPros.length > 1 ? 's' : ''} trouvé{filteredPros.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid gap-4">
            {filteredPros.map((pro) => (
              <div
                key={pro.id}
                className="card-bg border border-theme rounded-2xl p-5 flex flex-col sm:flex-row gap-4 card-hover"
              >
                {/* Avatar */}
                <div className="w-16 h-16 rounded-xl bg-[rgba(128,128,128,0.12)] flex items-center justify-center text-3xl shrink-0 self-start">
                  {pro.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-pri">{pro.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(167,139,250,0.15)] text-[#A78BFA]">
                      {pro.level === 'elite' ? 'Elite' : 'Expert'}
                    </span>
                  </div>
                  <p className="text-sm text-gold mb-2">{pro.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ter mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {pro.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-gold fill-[var(--gold)]" />
                      {pro.rating} ({pro.reviews} avis)
                    </span>
                    <span>{pro.priceMin.toLocaleString()} - {pro.priceMax.toLocaleString()} XAF</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {pro.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-full text-[10px] bg-[rgba(128,128,128,0.06)] text-sec border border-theme"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score */}
                <div className="flex flex-row sm:flex-col items-center gap-3 shrink-0 self-start sm:self-center">
                  <div className="w-12 h-12 rounded-full border-2 border-[#D4A853] flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-gold">{pro.proScore}</span>
                  </div>
                  <button className="btn-gold text-xs py-2 px-4">
                    Contacter
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredPros.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-ter mx-auto mb-4" />
              <h3 className="text-lg font-medium text-pri mb-2">Aucun résultat</h3>
              <p className="text-sm text-ter">Essayez avec d'autres critères de recherche</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
