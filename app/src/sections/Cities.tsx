import { useState } from 'react';
import { MapPin, Users, Layers, Building } from 'lucide-react';

const cities = [
  { id: '1', name: 'Douala', region: 'Littoral', population: '4,5M', pros: 1240, categories: 18, neighborhoods: 32, color: '#3B82F6' },
  { id: '2', name: 'Yaoundé', region: 'Centre', population: '4M', pros: 890, categories: 18, neighborhoods: 35, color: '#10B981' },
  { id: '3', name: 'Bafoussam', region: 'Ouest', population: '400K', pros: 270, categories: 15, neighborhoods: 15, color: '#F59E0B' },
  { id: '4', name: 'Garoua', region: 'Nord', population: '500K', pros: 145, categories: 12, neighborhoods: 15, color: '#EF4444' },
  { id: '5', name: 'Bamenda', region: 'Nord-Ouest', population: '500K', pros: 189, categories: 14, neighborhoods: 17, color: '#8B5CF6' },
  { id: '6', name: 'Ngaoundéré', region: 'Adamaoua', population: '300K', pros: 98, categories: 10, neighborhoods: 13, color: '#F97316' },
  { id: '7', name: 'Maroua', region: 'Extrême-Nord', population: '450K', pros: 134, categories: 11, neighborhoods: 17, color: '#14B8A6' },
  { id: '8', name: 'Bertoua', region: 'Est', population: '250K', pros: 87, categories: 10, neighborhoods: 11, color: '#EC4899' },
  { id: '9', name: 'Ebolowa', region: 'Sud', population: '150K', pros: 56, categories: 9, neighborhoods: 9, color: '#22C55E' },
  { id: '10', name: 'Buea', region: 'Sud-Ouest', population: '300K', pros: 167, categories: 13, neighborhoods: 19, color: '#6366F1' },
  { id: '11', name: 'Kribi', region: 'Sud', population: '100K', pros: 45, categories: 8, neighborhoods: 12, color: '#06B6D4' },
  { id: '12', name: 'Limbe', region: 'Sud-Ouest', population: '200K', pros: 112, categories: 12, neighborhoods: 15, color: '#84CC16' },
  { id: '13', name: 'Edéa', region: 'Littoral', population: '150K', pros: 78, categories: 9, neighborhoods: 10, color: '#A855F7' },
  { id: '14', name: 'Kumba', region: 'Sud-Ouest', population: '300K', pros: 134, categories: 12, neighborhoods: 12, color: '#D946EF' },
];

const topCategoriesByCity: Record<string, string[]> = {
  Douala: ['Plomberie', 'Électricité', 'Coiffure', 'Menuiserie', 'Climatisation'],
  Yaoundé: ['Électricité', 'Avocat', 'Développeur Web', 'Coiffure', 'Comptable'],
  Bafoussam: ['Menuiserie', 'Maçonnerie', 'Électricité', 'Coiffure', 'Peinture'],
  Garoua: ['Plomberie', 'Maçonnerie', 'Climatisation', 'Électricité', 'Coiffure'],
  Bamenda: ['Électricité', 'Informatique', 'Coiffure', 'Plomberie', 'Menuiserie'],
};

export default function Cities() {
  const [activeCity, setActiveCity] = useState(cities[0]);

  return (
    <section className="relative card-bg">
      <div className="container-max section-padding">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-gold tracking-wider uppercase">
            14 villes couvertes
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2">
            Partout au Cameroun
          </h2>
        </div>

        {/* City tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setActiveCity(city)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCity.id === city.id
                  ? 'bg-[#D4A853] text-[#0A0A0F]'
                  : 'card-bg text-sec border border-theme hover:border-[var(--gold-dim)]'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>

        {/* City detail */}
        <div className="card-bg border border-theme rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Visual */}
            <div 
              className="h-64 md:h-auto flex items-center justify-center relative"
              style={{ background: `linear-gradient(135deg, ${activeCity.color}20 0%, ${activeCity.color}10 100%)` }}
            >
              <div className="text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: activeCity.color }} />
                <h3 className="text-3xl font-bold text-pri">{activeCity.name}</h3>
                <p className="text-sec mt-1">{activeCity.region}</p>
              </div>
              {/* Decorative */}
              <div 
                className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium text-pri"
                style={{ backgroundColor: `${activeCity.color}40` }}
              >
                {activeCity.population} hab.
              </div>
            </div>

            {/* Stats */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-[rgba(255,255,255,0.02)] rounded-xl">
                  <Users className="w-5 h-5 text-gold mx-auto mb-1" />
                  <div className="text-xl font-bold text-pri">{activeCity.pros}</div>
                  <div className="text-[10px] text-ter">Pros actifs</div>
                </div>
                <div className="text-center p-3 bg-[rgba(255,255,255,0.02)] rounded-xl">
                  <Layers className="w-5 h-5 text-gold mx-auto mb-1" />
                  <div className="text-xl font-bold text-pri">{activeCity.categories}</div>
                  <div className="text-[10px] text-ter">Catégories</div>
                </div>
                <div className="text-center p-3 bg-[rgba(255,255,255,0.02)] rounded-xl">
                  <Building className="w-5 h-5 text-gold mx-auto mb-1" />
                  <div className="text-xl font-bold text-pri">{activeCity.neighborhoods}</div>
                  <div className="text-[10px] text-ter">Quartiers</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-sec mb-3">Top catégories</h4>
                <div className="flex flex-wrap gap-2">
                  {(topCategoriesByCity[activeCity.name] || ['Plomberie', 'Électricité', 'Coiffure']).map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-gold-dim text-gold border border-[var(--gold-dim)]"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
