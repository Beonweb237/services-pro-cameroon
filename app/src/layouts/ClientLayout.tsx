import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Briefcase, Heart, Star, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { icon: LayoutDashboard, label: 'Tableau de bord', path: '/client/dashboard' },
  { icon: MessageSquare, label: 'Messages', path: '/client/messages' },
  { icon: Briefcase, label: 'Missions', path: '/client/missions' },
  { icon: Heart, label: 'Favoris', path: '/client/favoris' },
  { icon: Star, label: 'Mes avis', path: '/client/avis' },
  { icon: Settings, label: 'Paramètres', path: '/client/parametres' },
];

export default function ClientLayout() {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen page-bg">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 card-bg/90 backdrop-blur-xl border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-sm font-bold text-pri">Services <span className="gold-text-gradient">Pro</span></Link>
        <ThemeToggle size="sm" />
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 card-bg border-r border-[var(--border-color)] z-40">
          <div className="p-5 flex items-center justify-between">
            <Link to="/" className="text-lg font-bold text-pri">Services <span className="gold-text-gradient">Pro</span></Link>
            <ThemeToggle size="sm" />
          </div>

          <div className="px-4 mb-4">
            <div className="p-3 rounded-xl bg-[var(--gold-dim)] border border-[var(--gold)]/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-lg">👤</div>
              <div>
                <div className="text-sm font-medium text-pri">Client</div>
                <div className="text-[10px] text-[var(--gold)]">Espace Client</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/');
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive ? 'bg-[var(--gold-dim)] text-[var(--gold)] font-medium' : 'text-sec hover:text-pri hover:bg-[var(--bg-hover)]'}`}>
                  <item.icon className="w-4 h-4" />{item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-[var(--border-color)]">
            <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-ter hover:text-[var(--danger)] hover:bg-[var(--danger)]/5 transition-all">
              <LogOut className="w-4 h-4" />Déconnexion
            </button>
          </div>
        </aside>

        {/* Mobile nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 card-bg/95 backdrop-blur-xl border-t border-[var(--border-color)] flex justify-around py-2 px-1">
          {navItems.slice(0, 5).map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg ${isActive ? 'text-[var(--gold)]' : 'text-ter'}`}>
                <item.icon className="w-4 h-4" />
                <span className="text-[9px]">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </nav>

        {/* Content */}
        <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
