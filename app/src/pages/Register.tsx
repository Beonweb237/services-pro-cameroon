import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, UserCog } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function Register() {
  const [role, setRole] = useState<'client' | 'pro'>('client');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    firstName: '',
    lastName: '',
    fullName: '',
    categoryId: '',
    cityId: '',
    title: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const registerClient = useAuthStore((s) => s.registerClient);
  const registerPro = useAuthStore((s) => s.registerPro);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (form.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);
    try {
      if (role === 'client') {
        await registerClient({
          email: form.email,
          password: form.password,
          phone: form.phone,
          firstName: form.firstName,
          lastName: form.lastName,
          cityId: form.cityId || undefined,
        });
      } else {
        await registerPro({
          email: form.email,
          password: form.password,
          phone: form.phone,
          fullName: form.fullName,
          categoryId: form.categoryId,
          cityId: form.cityId,
          title: form.title,
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda'];
  const categories = ['Plomberie', 'Électricité', 'Coiffure', 'Menuiserie', 'Maçonnerie', 'Développement Web', 'Design Graphique'];

  return (
    <div className="min-h-screen page-bg flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-bold text-pri">
            Services <span className="gold-text-gradient">Pro</span>
          </Link>
        </div>

        <div className="card-bg border border-theme rounded-2xl p-6">
          <h1 className="text-xl font-bold text-pri mb-1">Inscription</h1>
          <p className="text-sm text-ter mb-4">
            Créez votre compte en quelques étapes
          </p>

          {/* Role selector */}
          <div className="flex gap-2 mb-6 p-1 card-bg rounded-xl">
            <button
              onClick={() => setRole('client')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                role === 'client'
                  ? 'bg-[#D4A853] text-[#0A0A0F]'
                  : 'text-sec hover:text-pri'
              }`}
            >
              <User className="w-4 h-4" />
              Client
            </button>
            <button
              onClick={() => setRole('pro')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                role === 'pro'
                  ? 'bg-[#D4A853] text-[#0A0A0F]'
                  : 'text-sec hover:text-pri'
              }`}
            >
              <UserCog className="w-4 h-4" />
              Professionnel
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[rgba(231,76,60,0.10)] border border-[rgba(231,76,60,0.20)] text-sm text-[#E74C3C]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Basic info */}
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm text-sec mb-1.5">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                    className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri placeholder:text-ter outline-none focus:border-[#D4A853] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm text-sec mb-1.5">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+237 6XX XXX XXX"
                    required
                    className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri placeholder:text-ter outline-none focus:border-[#D4A853] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-sec mb-1.5">Mot de passe *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Min. 8 car."
                        required
                        className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri placeholder:text-ter outline-none focus:border-[#D4A853] transition-colors pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ter"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-sec mb-1.5">Confirmer *</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri placeholder:text-ter outline-none focus:border-[#D4A853] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full btn-gold"
                >
                  Continuer
                </button>
              </>
            )}

            {/* Step 2: Profile info */}
            {step === 2 && (
              <>
                {role === 'client' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm text-sec mb-1.5">Prénom *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          placeholder="Prénom"
                          required
                          className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri placeholder:text-ter outline-none focus:border-[#D4A853] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-sec mb-1.5">Nom *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          placeholder="Nom"
                          required
                          className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri placeholder:text-ter outline-none focus:border-[#D4A853] transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-sec mb-1.5">Ville</label>
                      <select
                        name="cityId"
                        value={form.cityId}
                        onChange={handleChange}
                        className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri outline-none focus:border-[#D4A853] transition-colors"
                      >
                        <option value="">Sélectionnez...</option>
                        {cities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm text-sec mb-1.5">Nom complet *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Votre nom complet"
                        required
                        className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri placeholder:text-ter outline-none focus:border-[#D4A853] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-sec mb-1.5">Titre métier *</label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Ex: Plombier — Dépannage urgent"
                        required
                        className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri placeholder:text-ter outline-none focus:border-[#D4A853] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-sec mb-1.5">Catégorie *</label>
                      <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        required
                        className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri outline-none focus:border-[#D4A853] transition-colors"
                      >
                        <option value="">Sélectionnez...</option>
                        {categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-sec mb-1.5">Ville *</label>
                      <select
                        name="cityId"
                        value={form.cityId}
                        onChange={handleChange}
                        required
                        className="w-full card-bg border border-theme rounded-xl px-4 py-2.5 text-sm text-pri outline-none focus:border-[#D4A853] transition-colors"
                      >
                        <option value="">Sélectionnez...</option>
                        {cities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2.5 rounded-full text-sm font-medium text-sec border border-theme hover:border-[var(--gold)] hover:text-gold transition-all"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 btn-gold disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-[#0A0A0F] border-t-transparent rounded-full animate-spin inline-block" />
                    ) : (
                      "S'inscrire"
                    )}
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-4 pt-4 border-t border-theme text-center">
            <p className="text-sm text-ter">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-gold hover:text-[#E8C87A]">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
