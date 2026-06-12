import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Briefcase, User, Calendar, BarChart3, FileText, Zap, Star, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/pro/dashboard' },
  { icon: MessageSquare, label: 'Messages', path: '/pro/messages' },
  { icon: User, label: 'Mon profil', path: '/pro/profil' },
  { icon: Calendar, label: 'Disponibilités', path: '/pro/disponibilites' },
  { icon: Briefcase, label: 'Missions', path: '/pro/missions' },
  { icon: Star, label: 'Avis reçus', path: '/pro/avis' },
  { icon: BarChart3, label: 'Statistiques', path: '/pro/statistiques' },
  { icon: FileText, label: 'Documents', path: '/pro/documents' },
  { icon: Zap, label: 'Boost', path: '/pro/boost' },
  { icon: Settings, label: 'Paramètres', path: '/pro/parametres' },
];

export default function ProLayout() {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen page-bg">
      <div className="hidden lg:block fixed top-0 left-0 right-0 z-40 card-bg/90 backdrop-blur-xl border-b border-[var(--border-color)] px-6 py-3">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <Link to="/" className="text-lg font-bold text-pri">Services <span className="gold-text-gradient">Pro</span></Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-ter">
              <span className="w-2 h-2 rounded-full bg-[var(--success)]" />En ligne
            </div>
            <ThemeToggle size="sm" />
          </div>
        </div>
      </div>

      <div className="flex pt-0 lg:pt-12">
        <aside className="hidden lg:flex flex-col w-56 fixed left-0 top-12 bottom-0 card-bg border-r border-[var(--border-color)] z-30">
          <div className="p-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[var(--gold-dim)] to-[var(--gold-dim)]/30 border border-[var(--gold)]/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-lg">👨‍🔧</div>
              <div>
                <div className="text-sm font-medium text-pri">Pro</div>
                <div className="text-[10px] text-[var(--gold)]">Niveau Expert</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-[var(--gold-dim)] text-[var(--gold)] font-medium' : 'text-sec hover:text-pri hover:bg-[var(--bg-hover)]'}`}>
                  <item.icon className="w-4 h-4" />{item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-2 border-t border-[var(--border-color)]">
            <button onClick={logout} className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm text-ter hover:text-[var(--danger)] transition-all">
              <LogOut className="w-4 h-4" />Déconnexion
            </button>
          </div>
        </aside>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 card-bg/95 backdrop-blur-xl border-t border-[var(--border-color)] flex justify-around py-1.5 px-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg ${isActive ? 'text-[var(--gold)]' : 'text-ter'}`}>
                <item.icon className="w-4 h-4" /><span className="text-[9px]">{item.label.slice(0, 8)}</span>
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 lg:ml-56 p-4 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
