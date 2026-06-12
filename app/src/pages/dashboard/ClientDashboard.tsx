import { Link } from 'react-router-dom';
import { MessageSquare, Briefcase, Heart, Star, MapPin } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const recentPros = [
  { id: '1', name: 'Jean Kouam', category: 'Plombier', city: 'Douala', score: 96, emoji: '🔧', status: 'now' },
  { id: '2', name: 'Marie T.', category: 'Électricienne', city: 'Yaoundé', score: 94, emoji: '⚡', status: 'week' },
  { id: '3', name: 'Sophie A.', category: 'Coiffeuse', city: 'Douala', score: 93, emoji: '✂️', status: 'now' },
];

const missions = [
  { id: '1', title: 'Réparation fuite douche', pro: 'Jean Kouam', status: 'completed', date: '15 mai 2026' },
  { id: '2', title: 'Installation électrique', pro: 'Marie T.', status: 'in_progress', date: '28 mai 2026' },
];

const statusColors: Record<string, string> = {
  completed: 'var(--success)', in_progress: 'var(--warning)', pending: 'var(--info)',
};
const statusLabels: Record<string, string> = {
  completed: 'Terminée', in_progress: 'En cours', pending: 'En attente',
};

export default function ClientDashboard() {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Missions', value: '12', icon: Briefcase, color: 'var(--gold)' },
    { label: 'Messages', value: '3', icon: MessageSquare, color: 'var(--info)' },
    { label: 'Favoris', value: '8', icon: Heart, color: 'var(--danger)' },
    { label: 'Avis à déposer', value: '2', icon: Star, color: 'var(--success)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pri">Bonjour, {user?.email?.split('@')[0] || 'Client'} 👋</h1>
        <p className="text-sm text-sec mt-1">Voici ce qui se passe sur votre compte.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card-bg card-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
              <span className="text-2xl font-bold text-pri">{s.value}</span>
            </div>
            <span className="text-xs text-ter">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Missions récentes */}
        <div className="lg:col-span-2 card-bg card-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-pri">Missions récentes</h2>
            <Link to="/client/missions" className="text-xs text-[var(--gold)] hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-3">
            {missions.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-hover)]/30">
                <div>
                  <div className="text-sm font-medium text-pri">{m.title}</div>
                  <div className="text-xs text-ter mt-0.5">avec {m.pro} — {m.date}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${statusColors[m.status]}15`, color: statusColors[m.status] }}>
                  {statusLabels[m.status]}
                </span>
              </div>
            ))}
          </div>
          {missions.length === 0 && <p className="text-sm text-ter text-center py-6">Aucune mission pour le moment.</p>}
        </div>

        {/* Quick actions */}
        <div className="card-bg card-border rounded-xl p-5">
          <h2 className="font-semibold text-pri mb-4">Actions rapides</h2>
          <div className="space-y-2">
            <Link to="/trouver" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--gold-dim)] text-[var(--gold)] text-sm font-medium hover:brightness-110 transition-all">
              <MapPin className="w-4 h-4" />Trouver un pro
            </Link>
            <Link to="/client/avis" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-hover)]/30 text-sec text-sm hover:text-pri transition-all">
              <Star className="w-4 h-4" />Déposer un avis
            </Link>
          </div>
        </div>
      </div>

      {/* Pros recommandés */}
      <div className="card-bg card-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-pri">Professionnels recommandés</h2>
          <Link to="/trouver" className="text-xs text-[var(--gold)] hover:underline">Explorer</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentPros.map((pro) => (
            <Link key={pro.id} to={`/pro/${pro.id}`} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-hover)]/20 hover:bg-[var(--bg-hover)]/40 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-lg">{pro.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-pri group-hover:text-[var(--gold)] transition-colors truncate">{pro.name}</div>
                <div className="text-[11px] text-ter">{pro.category} — {pro.city}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-bold text-[var(--gold)]">{pro.score}</div>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${pro.status === 'now' ? 'bg-[var(--success)]' : pro.status === 'week' ? 'bg-[var(--warning)]' : 'bg-[var(--danger)]'}`} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
