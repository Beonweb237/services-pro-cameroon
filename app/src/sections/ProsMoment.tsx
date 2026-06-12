import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react';

const mockPros = [
  { id: '1', name: 'Jean Kouam', category: 'Plombier', city: 'Douala', proScore: 96, reviews: 48, emoji: '🔧', level: 'elite' as const },
  { id: '2', name: 'Marie T.', category: 'Électricienne', city: 'Yaoundé', proScore: 94, reviews: 62, emoji: '⚡', level: 'elite' as const },
  { id: '3', name: 'Paul Biya', category: 'Menuisier', city: 'Bafoussam', proScore: 91, reviews: 35, emoji: '🪚', level: 'expert' as const },
  { id: '4', name: 'Sophie A.', category: 'Coiffeuse', city: 'Douala', proScore: 93, reviews: 89, emoji: '✂️', level: 'elite' as const },
  { id: '5', name: 'Eric M.', category: 'Développeur', city: 'Buea', proScore: 95, reviews: 27, emoji: '💻', level: 'elite' as const },
  { id: '6', name: 'Aline K.', category: 'Avocate', city: 'Yaoundé', proScore: 92, reviews: 41, emoji: '⚖️', level: 'expert' as const },
  { id: '7', name: 'Franck D.', category: 'Peintre', city: 'Douala', proScore: 88, reviews: 53, emoji: '🖌️', level: 'expert' as const },
  { id: '8', name: 'Grace N.', category: 'Designer', city: 'Bamenda', proScore: 90, reviews: 34, emoji: '🎨', level: 'expert' as const },
  { id: '9', name: 'Robert F.', category: 'Mécanicien', city: 'Garoua', proScore: 87, reviews: 45, emoji: '🔩', level: 'expert' as const },
];

const levelConfig = {
  certified: { color: '#3B82F6', label: 'Certifié' },
  expert:    { color: '#D4A853', label: 'Expert' },
  elite:     { color: '#A78BFA', label: 'Elite' },
  partner:   { color: '#EC4899', label: 'Partenaire' },
};

export default function ProsMoment() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative card-bg">
      <div className="container-max section-padding">
        <div className="reveal flex items-end justify-between mb-10">
          <div>
            <span className="section-label">Nos meilleurs pros</span>
            <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2">
              Pros du Moment
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-theme flex items-center justify-center text-ter hover:text-pri hover:border-[var(--gold)] transition-all hover:bg-gold-dim"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-theme flex items-center justify-center text-ter hover:text-pri hover:border-[var(--gold)] transition-all hover:bg-gold-dim"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {mockPros.map((pro, i) => {
            const lvl = levelConfig[pro.level];
            return (
              <Link
                key={pro.id}
                to={`/pro/${pro.id}`}
                className={`reveal reveal-delay-${Math.min(i + 1, 6)} snap-start shrink-0 w-[260px] group`}
              >
                <div className="card-bg border border-theme rounded-2xl overflow-hidden card-hover h-full">
                  {/* Cover */}
                  <div className="h-24 bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-hover)] relative">
                    <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-20 group-hover:opacity-30 transition-opacity group-hover:scale-110 duration-500">
                      {pro.emoji}
                    </div>
                    <div
                      className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full text-pri"
                      style={{ backgroundColor: `${lvl.color}30`, color: lvl.color }}
                    >
                      {lvl.label}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-4 relative">
                    <div className="w-14 h-14 rounded-xl bg-[rgba(128,128,128,0.12)] border-2 flex items-center justify-center text-2xl -mt-7 mb-3 shadow-lg group-hover:scale-105 transition-transform duration-300"
                      style={{ borderColor: lvl.color + '60' }}>
                      {pro.emoji}
                    </div>

                    <h3 className="font-semibold text-pri group-hover:text-gold transition-colors">
                      {pro.name}
                    </h3>
                    <p className="text-sm text-sec">{pro.category}</p>

                    <div className="flex items-center gap-1 mt-1 text-xs text-ter">
                      <MapPin className="w-3 h-3" />
                      {pro.city}
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-theme">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: '#D4A853' }}>
                          <span className="text-[10px] font-bold text-gold">{pro.proScore}</span>
                        </div>
                        <span className="text-[10px] text-ter">Pro Score</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-ter">
                        <Star className="w-3 h-3 text-gold fill-[var(--gold)]" />
                        {pro.reviews}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
