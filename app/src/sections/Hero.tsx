import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, Shield, Zap, Search, MapPin, TrendingUp } from 'lucide-react';

/* ==========================================
   Données : 9 catégories phares ( lisibles )
   ========================================== */
const CATEGORIES = [
  { name: 'Plomberie', count: 180, icon: '🔧', color: '#3B82F6' },
  { name: 'Électricité', count: 245, icon: '⚡', color: '#F59E0B' },
  { name: 'Coiffure', count: 320, icon: '✂️', color: '#EC4899' },
  { name: 'Menuiserie', count: 156, icon: '🪚', color: '#8B5CF6' },
  { name: 'Maçonnerie', count: 198, icon: '🧱', color: '#F97316' },
  { name: 'Développement', count: 134, icon: '💻', color: '#10B981' },
  { name: 'Design', count: 89, icon: '🎨', color: '#06B6D4' },
  { name: 'Photographie', count: 67, icon: '📸', color: '#14B8A6' },
  { name: 'Climatisation', count: 112, icon: '❄️', color: '#6366F1' },
];

/* ==========================================
   Particules dorées (Canvas 2D)
   ========================================== */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.2,
      radius: Math.random() * 1.8 + 0.6,
      opacity: Math.random() * 0.4 + 0.15,
    }));

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (100 - dist) / 100 * 0.6;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,168,83,${p.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212,168,83,${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 1 }}
    />
  );
}

/* ==========================================
   Carrousel 3D cylindrique – 9 cartes
   ========================================== */
function CylinderCarousel() {
  const [rotation, setRotation] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef<number>(0);
  const rotationRef = useRef(0);

  const RADIUS = 280;
  const COUNT = CATEGORIES.length;
  const STEP = 360 / COUNT;

  const animate = useCallback(() => {
    if (!paused) {
      rotationRef.current += 0.15;
      setRotation(rotationRef.current);
    }
    rafRef.current = requestAnimationFrame(animate);
  }, [paused]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return (
    <div
      className="relative w-full flex items-center justify-center select-none"
      style={{ height: 480, perspective: 1000 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Anneaux décoratifs */}
      <div
        className="absolute rounded-full border gold-ring"
        style={{ width: RADIUS * 1.6, height: RADIUS * 1.6, borderColor: 'var(--gold-dim)' }}
      />
      <div
        className="absolute rounded-full border gold-ring-outer"
        style={{ width: RADIUS * 2.2, height: RADIUS * 2.2, borderColor: 'var(--gold-dim)', opacity: 0.5 }}
      />

      {/* Cartes */}
      <div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {CATEGORIES.map((cat, i) => {
          const angle = STEP * i + rotation;
          const rad = (angle * Math.PI) / 180;
          const x = Math.sin(rad) * RADIUS;
          const z = Math.cos(rad) * RADIUS;
          const isFront = z > 0;
          const isHovered = hovered === i;
          const scale = isFront ? 1 : 0.78;
          const opacity = isFront ? 1 : 0.35;

          return (
            <div
              key={cat.name}
              className="absolute left-1/2 top-1/2 cursor-pointer"
              style={{
                width: 140,
                transform: `
                  translate(-50%, -50%)
                  translateX(${x}px)
                  translateZ(${z}px)
                  rotateY(${-angle}deg)
                  scale(${isHovered ? scale * 1.08 : scale})
                `,
                transformStyle: 'preserve-3d',
                opacity,
                transition: isHovered ? 'transform 0.3s ease' : 'opacity 0.4s ease',
                zIndex: Math.round(z + RADIUS),
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className={`
                  rounded-2xl p-5 text-center border
                  transition-all duration-300 backdrop-blur-sm
                  ${isHovered
                    ? 'border-[rgba(212,168,83,0.5)] shadow-[0_0_30px_rgba(212,168,83,0.15)] card-bg'
                    : 'border-theme card-bg'
                  }
                `}
                style={{ backgroundColor: isHovered ? 'var(--bg-elevated)' : 'var(--bg-secondary)' }}
              >
                {/* Glow ring on hover */}
                {isHovered && (
                  <div
                    className="absolute inset-0 rounded-2xl opacity-20"
                    style={{ boxShadow: `0 0 40px ${cat.color}40` }}
                  />
                )}

                <div className="text-4xl mb-3 relative z-10">{cat.icon}</div>
                <div className="text-sm font-semibold text-pri relative z-10 leading-tight">
                  {cat.name}
                </div>
                <div className="text-[11px] text-gold mt-1.5 relative z-10 font-medium">
                  {cat.count} pros
                </div>

                {/* Mini barre de progression */}
                <div className="mt-2.5 h-1 bg-theme rounded-full overflow-hidden relative z-10" style={{ backgroundColor: 'var(--border-color)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: isHovered ? `${(cat.count / 350) * 100}%` : '0%',
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Centre décoratif */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-20 h-20 rounded-full border flex items-center justify-center" style={{ borderColor: 'var(--gold-dim)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--gold-dim)' }}>
            <TrendingUp className="w-5 h-5 text-gold" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   Hero principal
   ========================================== */
export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const cities = ['Douala', 'Yaoundé', 'Bafoussam', 'Garoua', 'Bamenda'];

  return (
    <section className="relative min-h-screen overflow-hidden page-bg">
      {/* Gradient de fond subtil */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-primary)] to-[var(--bg-secondary)]" />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, var(--gold) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>

      {/* Particules */}
      <ParticleCanvas />

      {/* Contenu */}
      <div className="relative z-10 container-max pt-28 pb-20 min-h-screen flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Gauche : texte */}
          <div className="space-y-8 max-w-xl">
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold tracking-wider uppercase mb-5">
                <span className="w-2 h-2 rounded-full bg-[#D4A853] animate-pulse" />
                La plateforme #1 au Cameroun
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[58px] font-extrabold text-pri leading-[1.08] tracking-tight">
                Trouvez le{' '}
                <span className="gold-text-gradient">Pro</span>{' '}
                qu'il vous faut
              </h1>
              <p className="mt-5 text-lg text-sec leading-relaxed">
                Plus de <strong className="text-pri">2 400 professionnels vérifiés</strong> dans{' '}
                <strong className="text-pri">14 villes</strong>. Plomberie, électricité, coiffure,
                développement web et bien plus encore.
              </p>
            </div>

            {/* Barre de recherche */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-bg border border-theme rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <div className="flex-1 flex items-center gap-3 px-4 py-2.5">
                  <Search className="w-4 h-4 text-ter shrink-0" />
                  <input
                    type="text"
                    placeholder="Quel service cherchez-vous ?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm text-pri placeholder:text-ter outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 px-4 py-2.5 border-t sm:border-t-0 sm:border-l border-theme">
                  <MapPin className="w-4 h-4 text-ter shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent text-sm text-pri outline-none cursor-pointer"
                  >
                    <option value="">Toutes les villes</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Link
                  to={`/trouver?q=${encodeURIComponent(searchQuery)}&city=${selectedCity}`}
                  className="btn-gold text-center py-3 px-6 text-sm whitespace-nowrap"
                >
                  Trouver un Pro
                </Link>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 text-sm text-sec animate-slide-up" style={{ animationDelay: '0.35s' }}>
              {[
                { icon: Star, text: '4.8/5 Note moyenne', color: '#D4A853', fill: true },
                { icon: Shield, text: 'Pros vérifiés', color: '#2ECC71' },
                { icon: Zap, text: 'Réponse sous 24h', color: '#F5A623' },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2">
                  <badge.icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: badge.color }}
                    {...(badge.fill ? { fill: badge.color } : {})}
                  />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Droite : carrousel 3D */}
          <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CylinderCarousel />
          </div>
        </div>

        {/* Badge satisfaction flottant */}
        <div className="absolute bottom-10 right-8 hidden lg:block animate-float">
          <div className="card-bg border border-[rgba(212,168,83,0.2)] rounded-2xl px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold-dim flex items-center justify-center">
                <Star className="w-5 h-5 text-gold" fill="#D4A853" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gold leading-none">94%</div>
                <div className="text-xs text-ter mt-0.5">de satisfaction client</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
