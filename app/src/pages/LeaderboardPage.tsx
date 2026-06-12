import { useState } from 'react';
import { ChevronUp, ChevronDown, Minus, Star, MapPin, Trophy } from 'lucide-react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import { useReveal } from '@/hooks/useReveal';

const mockData = [
  { id: '1', rank: 1, prev: 2, name: 'Jean Kouam', category: 'Plombier', city: 'Douala', score: 96, reviews: 48, missions: 127, avail: 'now', emoji: '🔧' },
  { id: '2', rank: 2, prev: 1, name: 'Marie T.', category: 'Électricienne', city: 'Yaoundé', score: 94, reviews: 62, missions: 98, avail: 'week', emoji: '⚡' },
  { id: '3', rank: 3, prev: 5, name: 'Paul B.', category: 'Menuisier', city: 'Bafoussam', score: 91, reviews: 35, missions: 84, avail: 'now', emoji: '🪚' },
  { id: '4', rank: 4, prev: 3, name: 'Sophie A.', category: 'Coiffeuse', city: 'Douala', score: 93, reviews: 89, missions: 156, avail: 'busy', emoji: '✂️' },
  { id: '5', rank: 5, prev: 4, name: 'Eric M.', category: 'Développeur', city: 'Buea', score: 95, reviews: 27, missions: 45, avail: 'now', emoji: '💻' },
  { id: '6', rank: 6, prev: 8, name: 'Aline K.', category: 'Avocate', city: 'Yaoundé', score: 92, reviews: 41, missions: 67, avail: 'week', emoji: '⚖️' },
  { id: '7', rank: 7, prev: 6, name: 'Franck D.', category: 'Peintre', city: 'Douala', score: 88, reviews: 53, missions: 92, avail: 'now', emoji: '🖌️' },
  { id: '8', rank: 8, prev: 7, name: 'Grace N.', category: 'Designer', city: 'Bamenda', score: 90, reviews: 34, missions: 51, avail: 'busy', emoji: '🎨' },
  { id: '9', rank: 9, prev: 11, name: 'Robert F.', category: 'Mécanicien', city: 'Garoua', score: 87, reviews: 45, missions: 73, avail: 'week', emoji: '🔩' },
  { id: '10', rank: 10, prev: 9, name: 'Linda S.', category: 'Infirmière', city: 'Douala', score: 89, reviews: 38, missions: 112, avail: 'now', emoji: '🏥' },
];

const podiumColors = ['#D4A853', '#A0A0B8', '#CD7F32'];


function RankChange({ cur, prev }: { cur: number; prev: number }) {
  const d = prev - cur;
  if (d > 0) return <span className="flex items-center gap-0.5 text-[10px] text-[var(--success)] font-medium">+<ChevronUp className="w-3 h-3" />{d}</span>;
  if (d < 0) return <span className="flex items-center gap-0.5 text-[10px] text-[var(--danger)] font-medium"><ChevronDown className="w-3 h-3" />{Math.abs(d)}</span>;
  return <Minus className="w-3 h-3 text-ter" />;
}

function AvailDot({ s }: { s: string }) {
  const c = { now: 'var(--success)', week: 'var(--warning)', busy: 'var(--danger)' };
  const l = { now: 'Disponible', week: 'Cette sem.', busy: 'Occupé' };
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c[s as keyof typeof c] || '#6B6B80' }} />
      <span className="text-[11px] text-ter">{l[s as keyof typeof l] || s}</span>
    </span>
  );
}

export default function LeaderboardPage() {
  useReveal();
  const [period, setPeriod] = useState('monthly');
  const [filterAvail, setFilterAvail] = useState('');

  const podium = mockData.slice(0, 3);
  const rest = mockData.slice(3).filter(p => !filterAvail || p.avail === filterAvail);

  return (
    <div className="min-h-screen page-bg">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="container-max py-12">
          <div className="reveal text-center max-w-2xl mx-auto">
            <span className="section-label">Classement mensuel</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-pri mt-3">
              <span className="gold-text-gradient">Leaderboard</span>
            </h1>
            <p className="text-sec mt-4">
              Les professionnels les mieux notés du mois. Le podium change chaque mois selon le Pro Score.
            </p>
          </div>
        </div>

        {/* Period + filter */}
        <div className="container-max mb-8">
          <div className="reveal reveal-delay-1 flex flex-wrap gap-3 justify-center items-center">
            {['weekly', 'monthly', 'quarterly', 'allTime'].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${period === p ? 'bg-[var(--gold)] text-[#0A0A0F] font-medium' : 'card-bg card-border text-sec hover:text-pri'}`}>
                {p === 'weekly' ? 'Semaine' : p === 'monthly' ? 'Mois' : p === 'quarterly' ? 'Trimestre' : 'Toujours'}
              </button>
            ))}
            <div className="w-px h-6 bg-[var(--border-color)] mx-2" />
            <select value={filterAvail} onChange={(e) => setFilterAvail(e.target.value)}
              className="input-bg card-border rounded-full px-3 py-2 text-sm text-pri outline-none text-sec">
              <option value="">Tous</option>
              <option value="now">Disponible</option>
              <option value="week">Cette sem.</option>
              <option value="busy">Occupé</option>
            </select>
          </div>
        </div>

        {/* Podium */}
        <div className="container-max mb-10">
          <div className="reveal reveal-delay-2 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[1, 0, 2].map((idx) => {
              const p = podium[idx];
              return (
                <div key={p.id} className={`card-bg card-border rounded-2xl p-5 text-center relative ${idx === 0 ? 'md:order-2 md:-mt-4' : idx === 1 ? 'md:order-1' : 'md:order-3'}`}
                  style={{ borderColor: `${podiumColors[idx]}40` }}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: podiumColors[idx] }}>
                    <Trophy className="w-5 h-5 text-pri" />
                  </div>
                  <div className="mt-5">
                    <div className="text-3xl mb-2">{p.emoji}</div>
                    <h3 className="font-semibold text-pri">{p.name}</h3>
                    <p className="text-xs text-[var(--gold)]">{p.category}</p>
                    <div className="flex items-center justify-center gap-1 mt-1 text-xs text-ter">
                      <MapPin className="w-3 h-3" />{p.city}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ backgroundColor: `${podiumColors[idx]}12` }}>
                      <span className="text-xl font-bold" style={{ color: podiumColors[idx] }}>{p.score}</span>
                      <span className="text-[10px] text-ter">Pro Score</span>
                    </div>
                    <RankChange cur={p.rank} prev={p.prev} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="container-max">
          <div className="reveal reveal-delay-3 card-bg card-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left px-4 py-3 text-[11px] font-medium text-ter uppercase tracking-wider">Rang</th>
                    <th className="text-left px-4 py-3 text-[11px] font-medium text-ter uppercase tracking-wider">Professionnel</th>
                    <th className="text-left px-4 py-3 text-[11px] font-medium text-ter uppercase tracking-wider hidden md:table-cell">Ville</th>
                    <th className="text-left px-4 py-3 text-[11px] font-medium text-ter uppercase tracking-wider">Score</th>
                    <th className="text-left px-4 py-3 text-[11px] font-medium text-ter uppercase tracking-wider hidden sm:table-cell">Avis</th>
                    <th className="text-left px-4 py-3 text-[11px] font-medium text-ter uppercase tracking-wider">Dispo</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((p) => (
                    <tr key={p.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-hover)]/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium text-pri w-5">{p.rank}</span>
                          <RankChange cur={p.rank} prev={p.prev} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-sm">{p.emoji}</div>
                          <div>
                            <div className="text-sm font-medium text-pri">{p.name}</div>
                            <div className="text-[11px] text-ter">{p.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-sm text-sec">{p.city}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${p.score >= 90 ? 'text-[var(--success)]' : p.score >= 80 ? 'text-[var(--warning)]' : 'text-[var(--danger)]'}`}>{p.score}</span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="flex items-center gap-1 text-sm text-sec">
                          <Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" />{p.reviews}
                        </div>
                      </td>
                      <td className="px-4 py-3"><AvailDot s={p.avail} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
