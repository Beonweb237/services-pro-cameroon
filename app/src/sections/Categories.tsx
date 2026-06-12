import { Link } from 'react-router-dom';

const categories = [
  { name: 'Plomberie', slug: 'plomberie', pros: 180, emoji: '🔧' },
  { name: 'Électricité', slug: 'electricite', pros: 245, emoji: '⚡' },
  { name: 'Menuiserie', slug: 'menuiserie', pros: 156, emoji: '🪚' },
  { name: 'Maçonnerie', slug: 'maconnerie', pros: 198, emoji: '🧱' },
  { name: 'Peinture', slug: 'peinture', pros: 178, emoji: '🖌️' },
  { name: 'Jardinage', slug: 'jardinage', pros: 78, emoji: '🌿' },
  { name: 'Coiffure & Beauté', slug: 'coiffure-beaute', pros: 320, emoji: '✂️' },
  { name: 'Couture', slug: 'couture', pros: 95, emoji: '🧵' },
  { name: 'Mécanique Auto', slug: 'mecanique-auto', pros: 134, emoji: '🔩' },
  { name: 'Informatique', slug: 'informatique', pros: 134, emoji: '💻' },
  { name: 'Design Graphique', slug: 'design-graphique', pros: 89, emoji: '🎨' },
  { name: 'Photographie', slug: 'photographie', pros: 67, emoji: '📸' },
  { name: 'Cuisine & Traiteur', slug: 'cuisine-traiteur', pros: 95, emoji: '👨‍🍳' },
  { name: 'Nettoyage', slug: 'nettoyage', pros: 145, emoji: '🧹' },
  { name: 'Déménagement', slug: 'demenagement', pros: 56, emoji: '📦' },
  { name: 'Climatisation', slug: 'climatisation', pros: 112, emoji: '❄️' },
  { name: 'Ferronnerie', slug: 'ferronnerie', pros: 45, emoji: '⚒️' },
  { name: 'Carrelage', slug: 'carrelage', pros: 89, emoji: '⬜' },
  { name: 'Électronique', slug: 'electronique', pros: 72, emoji: '📱' },
  { name: 'Conseil & Gestion', slug: 'conseil-gestion', pros: 123, emoji: '📊' },
];

export default function Categories() {
  return (
    <section className="relative card-bg">
      <div className="container-max section-padding">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-gold tracking-wider uppercase">
            20 métiers
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2">
            Catégories populaires
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/trouver/${cat.slug}`}
              className="group relative h-36 rounded-2xl overflow-hidden card-hover"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-hover)] transition-transform duration-500 group-hover:scale-110" />
              
              {/* Overlay gradient adaptatif */}
              <div className="absolute inset-0 overlay-gradient" />

              {/* Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <h3 className="text-base font-semibold text-pri group-hover:text-gold transition-colors">
                  {cat.name}
                </h3>
                <span className="text-xs text-gold">{cat.pros} pros</span>
              </div>

              {/* Progress bar on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 gold-bar transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ backgroundColor: 'var(--gold-dim)' }}>
                <div 
                  className="h-full gold-fill" 
                  style={{ width: `${Math.min(100, (cat.pros / 350) * 100)}%`, backgroundColor: 'var(--gold)' }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
