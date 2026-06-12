import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ArrowRight, User, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const DEMO_ACCOUNTS = [
  { label: 'Client', email: 'client@demo.com', password: 'Demo1234' },
  { label: 'Pro', email: 'pro@demo.com', password: 'Demo1234' },
  { label: 'Admin', email: 'admin@demo.com', password: 'Demo1234' },
];

export default function Login() {
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState(DEMO_ACCOUNTS[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const fillDemo = (idx: number) => {
    setEmail(DEMO_ACCOUNTS[idx].email);
    setPassword(DEMO_ACCOUNTS[idx].password);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow décoratif */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, #D4A853 0%, transparent 70%)', filter: 'blur(100px)' }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-pri">
            Services <span className="gold-text-gradient">Pro</span>
          </Link>
          <p className="text-xs text-sec mt-1 tracking-wider uppercase">Cameroun</p>
        </div>

        <div className="card-bg card-border rounded-2xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.15)] animate-slide-up">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-pri">Connexion</h1>
            <p className="text-sm text-ter mt-1">
              Accédez à votre espace personnel
            </p>
          </div>

          {/* Comptes de démo */}
          <div className="mb-5 p-3 rounded-xl bg-gold-dim border border-[var(--gold-dim)]">
            <p className="text-[11px] text-ter uppercase tracking-wider mb-2 font-medium">
              Comptes de démo
            </p>
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => fillDemo(idx)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    email === acc.email
                      ? 'bg-[#D4A853] text-[#0A0A0F]'
                      : 'bg-[rgba(128,128,128,0.06)] text-sec hover:text-pri hover:bg-[rgba(128,128,128,0.10)]'
                  }`}
                >
                  <User className="w-3 h-3" />
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-error-light border border-error text-sm text-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm text-sec mb-1.5">
                <User className="w-3.5 h-3.5 text-sec" />
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="w-full input-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri placeholder:text-muted outline-none focus:border-[#D4A853] focus:shadow-[0_0_0_3px_rgba(212,168,83,0.08)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm text-sec mb-1.5">
                <Lock className="w-3.5 h-3.5 text-sec" />
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full input-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri placeholder:text-muted outline-none focus:border-[#D4A853] focus:shadow-[0_0_0_3px_rgba(212,168,83,0.08)] transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sec hover:text-sec transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-4 h-4 rounded border border-theme bg-input-bg peer-checked:bg-[#D4A853] peer-checked:border-[#D4A853] transition-all" />
                  <svg
                    className="absolute top-0.5 left-0.5 w-3 h-3 text-[#0A0A0F] opacity-0 peer-checked:opacity-100 pointer-events-none"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-xs text-sec group-hover:text-sec transition-colors">Se souvenir de moi</span>
              </label>
              <Link to="/mot-de-passe-oublie" className="text-xs text-gold hover:text-[#E8C87A] transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-theme text-center">
            <p className="text-sm text-sec">
              Pas encore de compte ?{' '}
              <Link to="/inscription/client" className="text-gold hover:text-[#E8C87A] font-medium transition-colors">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

        {/* Retour */}
        <div className="text-center mt-5">
          <Link
            to="/"
            className="text-xs text-sec hover:text-sec transition-colors inline-flex items-center gap-1"
          >
            <ArrowRight className="w-3 h-3 rotate-180" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
