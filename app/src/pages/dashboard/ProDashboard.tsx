import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Briefcase, Star, TrendingUp, Eye, Zap, Calendar, ChevronRight } from 'lucide-react';

const stats = [
  { label: 'Pro Score', value: '87', icon: TrendingUp, color: 'var(--gold)', change: '+3 ce mois' },
  { label: 'Vues profil', value: '156', icon: Eye, color: 'var(--info)', change: '+12% vs mois dernier' },
  { label: 'Messages', value: '5', icon: MessageSquare, color: 'var(--success)', change: '2 non lus' },
  { label: 'Missions', value: '23', icon: Briefcase, color: 'var(--warning)', change: '12 ce mois' },
];

const recentReviews = [
  { id: '1', client: 'Marie D.', rating: 5, comment: 'Excellent travail, très professionnel !', date: '2 jours' },
  { id: '2', client: 'Pierre M.', rating: 4, comment: 'Bon service, ponctuel.', date: '1 sem.' },
];

const availOptions = [
  { value: 'available', label: 'Disponible', color: 'var(--success)', desc: 'Je peux accepter des missions' },
  { value: 'busy', label: 'Occupé', color: 'var(--warning)', desc: 'Je suis en mission en ce moment' },
  { value: 'unavailable', label: 'Indisponible', color: 'var(--danger)', desc: 'Je ne peux pas accepter de missions' },
];

export default function ProDashboard() {
  const [availStatus, setAvailStatus] = useState('available');
  const current = availOptions.find(a => a.value === availStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pri">Tableau de bord Pro</h1>
          <p className="text-sm text-sec mt-1">Gérez votre activité et votre visibilité.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: current?.color }} />
          <span className="text-sm text-sec">{current?.label}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card-bg card-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
              <span className="text-2xl font-bold text-pri">{s.value}</span>
            </div>
            <div className="text-xs text-ter">{s.label}</div>
            <div className="text-[10px] text-[var(--success)] mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Disponibilité rapide */}
        <div className="card-bg card-border rounded-xl p-5">
          <h2 className="font-semibold text-pri mb-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--gold)]" />Mon statut
          </h2>
          <p className="text-xs text-ter mb-4">Changez votre visibilité pour les clients.</p>
          <div className="space-y-2">
            {availOptions.map((opt) => (
              <button key={opt.value} onClick={() => setAvailStatus(opt.value)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${availStatus === opt.value ? 'border-2' : 'border border-[var(--border-color)] hover:bg-[var(--bg-hover)]/30'}`}
                style={availStatus === opt.value ? { borderColor: opt.color, backgroundColor: `${opt.color}08` } : {}}>
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                <div>
                  <div className="text-sm font-medium text-pri">{opt.label}</div>
                  <div className="text-[11px] text-ter">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
          <Link to="/pro/disponibilites" className="mt-3 flex items-center gap-1 text-xs text-[var(--gold)] hover:underline">
            <Calendar className="w-3 h-3" />Gérer mon calendrier<ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Avis récents */}
        <div className="lg:col-span-2 card-bg card-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-pri flex items-center gap-2"><Star className="w-4 h-4 text-[var(--gold)]" />Derniers avis</h2>
            <Link to="/pro/avis" className="text-xs text-[var(--gold)] hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {recentReviews.map((r) => (
              <div key={r.id} className="p-3 rounded-lg bg-[var(--bg-hover)]/20">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-[var(--gold)] fill-[var(--gold)]' : 'text-[var(--border-color)]'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-ter ml-auto">{r.date}</span>
                </div>
                <p className="text-sm text-sec">"{r.comment}"</p>
                <span className="text-[11px] text-ter">— {r.client}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Boost */}
      <div className="card-bg card-border rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--gold-dim)] flex items-center justify-center">
            <Zap className="w-5 h-5 text-[var(--gold)]" />
          </div>
          <div>
            <h3 className="font-semibold text-pri text-sm">Boostez votre visibilité</h3>
            <p className="text-xs text-ter">Apparaissez en tête des résultats de recherche.</p>
          </div>
        </div>
        <Link to="/pro/boost" className="btn-gold text-xs py-2 px-4">Booster</Link>
      </div>
    </div>
  );
}
