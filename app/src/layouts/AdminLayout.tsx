import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShieldCheck, AlertTriangle, BarChart3, Settings, LogOut, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: ShieldCheck, label: 'Validation profils', path: '/admin/validation' },
  { icon: AlertTriangle, label: 'Modération', path: '/admin/moderation' },
  { icon: Users, label: 'Utilisateurs', path: '/admin/utilisateurs' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: MessageSquare, label: 'Support', path: '/admin/support' },
  { icon: Settings, label: 'Configuration', path: '/admin/config' },
];

export default function AdminLayout() {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen page-bg">
      <div className="hidden lg:flex items-center justify-between fixed top-0 left-0 right-0 z-40 card-bg/90 backdrop-blur-xl border-b border-[var(--border-color)] px-6 py-3">
        <Link to="/" className="text-lg font-bold text-pri">Services <span className="gold-text-gradient">Pro</span> <span className="text-xs text-[var(--danger)] font-normal ml-1">Admin</span></Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-[var(--danger)] animate-pulse" />
            <span className="text-ter">3 alertes</span>
          </div>
          <ThemeToggle size="sm" />
        </div>
      </div>

      <div className="flex pt-0 lg:pt-12">
        <aside className="hidden lg:flex flex-col w-56 fixed left-0 top-12 bottom-0 card-bg border-r border-[var(--border-color)] z-30">
          <div className="p-4">
            <div className="p-3 rounded-xl bg-[var(--danger)]/5 border border-[var(--danger)]/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-lg">🛡️</div>
              <div>
                <div className="text-sm font-medium text-pri">Admin</div>
                <div className="text-[10px] text-[var(--danger)]">Contrôle total</div>
              </div>
            </div>
          </div>
          <nav className="flex-1 px-2 space-y-0.5">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-[var(--danger)]/10 text-[var(--danger)] font-medium' : 'text-sec hover:text-pri hover:bg-[var(--bg-hover)]'}`}>
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

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 card-bg/95 backdrop-blur-xl border-t border-[var(--border-color)] flex justify-around py-1.5">
          {navItems.slice(0, 5).map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg ${isActive ? 'text-[var(--danger)]' : 'text-ter'}`}>
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
