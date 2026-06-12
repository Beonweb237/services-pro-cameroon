import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = [
  { label: 'Trouver un Pro', href: '/trouver', hasDropdown: true },
  { label: 'Familles', href: '/familles' },
  { label: 'Villes', href: '/villes' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Tarifs', href: '/tarifs' },
  { label: 'FAQ', href: '/faq' },
];

const dropdownCategories = [
  { label: 'Plomberie', href: '/trouver/plomberie' },
  { label: 'Électricité', href: '/trouver/electricite' },
  { label: 'Coiffure', href: '/trouver/coiffure-beaute' },
  { label: 'Menuiserie', href: '/trouver/menuiserie' },
  { label: 'Développeur Web', href: '/trouver/developpeur-web' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dashboardLink = user?.role === 'pro' ? '/pro/dashboard'
    : user?.role === 'admin' || user?.role === 'moderator' ? '/admin/dashboard'
    : '/client/dashboard';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHome ? 'card-bg/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'
    }`} style={{ height: 64 }}>
      <div className="container-max h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-bold text-pri">Services <span className="gold-text-gradient">Pro</span></span>
          <span className="text-[10px] font-medium text-ter uppercase tracking-wider hidden sm:block">Cameroun</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.label} className="relative"
              onMouseEnter={() => link.hasDropdown && setDropdownOpen(true)}
              onMouseLeave={() => link.hasDropdown && setDropdownOpen(false)}>
              <Link to={link.href} className="flex items-center gap-1 px-3 py-2 text-sm text-sec hover:text-pri transition-colors">
                {link.label}
                {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
              </Link>
              {link.hasDropdown && dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 card-bg card-border rounded-xl shadow-xl overflow-hidden py-2 z-50">
                  {dropdownCategories.map((cat) => (
                    <Link key={cat.label} to={cat.href} className="flex items-center gap-3 px-4 py-2.5 text-sm text-sec hover:text-pri hover:bg-[var(--gold-dim)] transition-colors">
                      {cat.label}
                    </Link>
                  ))}
                  <div className="border-t border-[var(--border-color)] mt-2 pt-2">
                    <Link to="/trouver" className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--gold)] hover:text-[var(--gold-light)]">
                      <Search className="w-4 h-4" />Voir tous les métiers
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle size="sm" />
          {isAuthenticated && user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to={dashboardLink} className="flex items-center gap-1.5 text-sm text-sec hover:text-pri transition-colors px-3 py-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden xl:inline">Dashboard</span>
              </Link>
              <button onClick={logout} className="p-2 text-ter hover:text-[var(--danger)] transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-sm text-sec hover:text-pri transition-colors px-3 py-2">Connexion</Link>
              <Link to="/inscription/client" className="btn-gold text-sm py-2 px-4">S'inscrire</Link>
            </div>
          )}
          <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-ter hover:text-pri">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 card-bg z-40 overflow-auto">
          <div className="p-6 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-lg text-sec hover:text-pri py-2">
                {link.label}
              </Link>
            ))}
            <div className="border-t border-[var(--border-color)] pt-4 mt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to={dashboardLink} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-lg text-[var(--gold)] py-2">
                    <LayoutDashboard className="w-5 h-5" />Mon espace
                  </Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-lg text-ter py-2">Déconnexion</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-sec py-2">Connexion</Link>
                  <Link to="/inscription/client" onClick={() => setMobileMenuOpen(false)} className="block text-lg text-[var(--gold)] py-2">S'inscrire</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
