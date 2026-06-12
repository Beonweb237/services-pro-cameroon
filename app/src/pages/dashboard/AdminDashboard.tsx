import { Link } from 'react-router-dom';
import { Users, ShieldCheck, AlertTriangle, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

const stats = [
  { label: 'Utilisateurs', value: '1,240', icon: Users, color: 'var(--info)' },
  { label: 'En attente', value: '12', icon: ShieldCheck, color: 'var(--warning)' },
  { label: 'Alertes', value: '3', icon: AlertTriangle, color: 'var(--danger)' },
  { label: 'Messages support', value: '8', icon: MessageSquare, color: 'var(--success)' },
];

const pendingProfiles = [
  { id: '1', name: 'Kouamé Jean', category: 'Plombier', city: 'Douala', date: 'Il y a 2h', status: 'pending' },
  { id: '2', name: 'Aline T.', category: 'Coiffeuse', city: 'Yaoundé', date: 'Il y a 5h', status: 'pending' },
  { id: '3', name: 'Paul B.', category: 'Menuisier', city: 'Bafoussam', date: 'Il y a 1j', status: 'pending' },
];

const recentAlerts = [
  { id: '1', type: 'report', text: 'Signalement avis #482', severity: 'high', time: '10 min' },
  { id: '2', type: 'verify', text: 'Doc expiré : Dr. N.', severity: 'medium', time: '1h' },
  { id: '3', type: 'report', text: 'Message inapproprié', severity: 'low', time: '3h' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-pri">Dashboard Admin</h1>
        <p className="text-sm text-sec mt-1">Vue d'ensemble de la plateforme.</p>
      </div>

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

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Profils en attente */}
        <div className="card-bg card-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-pri flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[var(--warning)]" />Profils à valider</h2>
            <Link to="/admin/validation" className="text-xs text-[var(--gold)] hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-2">
            {pendingProfiles.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-hover)]/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-sm">👤</div>
                  <div>
                    <div className="text-sm font-medium text-pri">{p.name}</div>
                    <div className="text-[11px] text-ter">{p.category} — {p.city}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-ter">{p.date}</span>
                  <button className="p-1.5 rounded-lg hover:bg-[var(--success)]/10 text-[var(--success)] transition-colors"><CheckCircle className="w-4 h-4" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-[var(--danger)]/10 text-[var(--danger)] transition-colors"><XCircle className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertes */}
        <div className="card-bg card-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-pri flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[var(--danger)]" />Alertes récentes</h2>
            <Link to="/admin/moderation" className="text-xs text-[var(--gold)] hover:underline">Tout voir</Link>
          </div>
          <div className="space-y-2">
            {recentAlerts.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-hover)]/20">
                <span className={`w-2 h-2 rounded-full shrink-0 ${a.severity === 'high' ? 'bg-[var(--danger)] animate-pulse' : a.severity === 'medium' ? 'bg-[var(--warning)]' : 'bg-[var(--info)]'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-pri truncate">{a.text}</div>
                </div>
                <span className="text-[10px] text-ter shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
