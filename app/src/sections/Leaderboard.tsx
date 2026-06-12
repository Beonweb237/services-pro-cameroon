import { useState } from 'react';
import { Crown, Medal, ChevronUp, ChevronDown, Minus, Star, MapPin } from 'lucide-react';

const mockLeaderboard = [
  { id: '1', rank: 1, prevRank: 2, name: 'Jean Kouam', category: 'Plombier', city: 'Douala', proScore: 96, reviews: 48, available: 'now' },
  { id: '2', rank: 2, prevRank: 1, name: 'Marie T.', category: 'Électricienne', city: 'Yaoundé', proScore: 94, reviews: 62, available: 'week' },
  { id: '3', rank: 3, prevRank: 5, name: 'Paul Biya', category: 'Menuisier', city: 'Bafoussam', proScore: 91, reviews: 35, available: 'now' },
  { id: '4', rank: 4, prevRank: 3, name: 'Sophie A.', category: 'Coiffeuse', city: 'Douala', proScore: 93, reviews: 89, available: 'busy' },
  { id: '5', rank: 5, prevRank: 4, name: 'Eric M.', category: 'Développeur', city: 'Buea', proScore: 95, reviews: 27, available: 'now' },
  { id: '6', rank: 6, prevRank: 8, name: 'Aline K.', category: 'Avocate', city: 'Yaoundé', proScore: 92, reviews: 41, available: 'week' },
  { id: '7', rank: 7, prevRank: 6, name: 'Franck D.', category: 'Peintre', city: 'Douala', proScore: 88, reviews: 53, available: 'now' },
  { id: '8', rank: 8, prevRank: 7, name: 'Grace N.', category: 'Designer', city: 'Bamenda', proScore: 90, reviews: 34, available: 'busy' },
  { id: '9', rank: 9, prevRank: 11, name: 'Robert F.', category: 'Mécanicien', city: 'Garoua', proScore: 87, reviews: 45, available: 'week' },
  { id: '10', rank: 10, prevRank: 9, name: 'Linda S.', category: 'Infirmière', city: 'Douala', proScore: 89, reviews: 38, available: 'now' },
];

const podiumColors = ['#D4A853', '#A0A0B8', '#CD7F32'];
const podiumIcons = [Crown, Medal, Medal];

function RankChange({ current, previous }: { current: number; previous: number }) {
  const diff = previous - current;
  if (diff > 0) return <ChevronUp className="w-3 h-3 text-[#2ECC71]" />;
  if (diff < 0) return <ChevronDown className="w-3 h-3 text-[#E74C3C]" />;
  return <Minus className="w-3 h-3 text-ter" />;
}

function AvailabilityDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    now: '#2ECC71',
    week: '#F5A623',
    busy: '#E74C3C',
  };
  return (
    <span className="flex items-center gap-1.5 text-xs">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[status] || '#6B6B80' }} />
      <span className="text-ter">
        {status === 'now' ? "Auj." : status === 'week' ? "Cette sem." : "Occupé"}
      </span>
    </span>
  );
}

export default function Leaderboard() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const categories = ['Tous', 'Plomberie', 'Électricité', 'Coiffure', 'Menuiserie', 'Développement'];
  const periods = [
    { value: 'weekly', label: 'Cette semaine' },
    { value: 'monthly', label: 'Ce mois' },
    { value: 'quarterly', label: 'Ce trimestre' },
    { value: 'allTime', label: 'Toujours' },
  ];

  const podium = mockLeaderboard.slice(0, 3);
  const tableData = mockLeaderboard.slice(3);

  return (
    <section className="relative page-bg">
      <div className="container-max section-padding">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-gold tracking-wider uppercase">
            Classement
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2">
            Leaderboard
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Tous' ? '' : cat)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                (cat === 'Tous' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-[#D4A853] text-[#0A0A0F] font-medium'
                  : 'card-bg text-sec border border-theme hover:border-[var(--gold-dim)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setSelectedPeriod(p.value)}
              className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                selectedPeriod === p.value
                  ? 'text-gold bg-gold-dim'
                  : 'text-ter hover:text-sec'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
          {[1, 0, 2].map((idx) => {
            const pro = podium[idx];
            const Icon = podiumIcons[idx];
            return (
              <div
                key={pro.id}
                className={`relative card-bg border-2 rounded-2xl p-5 text-center ${
                  idx === 0 ? 'md:order-2 md:-mt-4' : idx === 1 ? 'md:order-1' : 'md:order-3'
                }`}
                style={{ borderColor: podiumColors[idx] }}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: podiumColors[idx] }}
                  >
                    <Icon className="w-4 h-4 text-pri" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-16 h-16 rounded-full bg-[rgba(128,128,128,0.12)] mx-auto mb-3 flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <h3 className="font-semibold text-pri">{pro.name}</h3>
                  <p className="text-sm text-sec">{pro.category}</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-ter">
                    <MapPin className="w-3 h-3" />
                    {pro.city}
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 bg-gold-dim px-3 py-1.5 rounded-full">
                    <span className="text-lg font-bold text-gold">{pro.proScore}</span>
                    <span className="text-xs text-ter">Pro Score</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="card-bg border border-theme rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme">
                  <th className="text-left px-4 py-3 text-xs font-medium text-ter uppercase">Rang</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ter uppercase">Professionnel</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ter uppercase hidden sm:table-cell">Ville</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ter uppercase">Pro Score</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ter uppercase hidden sm:table-cell">Avis</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-ter uppercase">Dispo</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((pro, i) => (
                  <tr
                    key={pro.id}
                    className={`border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] transition-colors ${
                      i % 2 === 0 ? 'bg-[rgba(255,255,255,0.01)]' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-pri w-5">{pro.rank}</span>
                        <RankChange current={pro.rank} previous={pro.prevRank} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[rgba(128,128,128,0.12)] flex items-center justify-center text-sm shrink-0">
                          👤
                        </div>
                        <div>
                          <div className="text-sm font-medium text-pri">{pro.name}</div>
                          <div className="text-xs text-ter">{pro.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-sm text-sec">{pro.city}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${
                        pro.proScore >= 85 ? 'text-[#2ECC71]' : pro.proScore >= 70 ? 'text-[#F5A623]' : 'text-[#E74C3C]'
                      }`}>
                        {pro.proScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-sm text-sec">
                        <Star className="w-3 h-3 text-gold fill-[var(--gold)]" />
                        {pro.reviews}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <AvailabilityDot status={pro.available} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
