import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    clientName: 'Marie D.',
    clientCity: 'Douala',
    clientEmoji: '👩',
    proName: 'Jean K.',
    proCategory: 'Plombier',
    proEmoji: '🔧',
    rating: 5,
    comment: 'Service impeccable ! Jean est arrivé à l\'heure, a résolu mon problème de fuite en moins d\'une heure. Le prix était très raisonnable. Je recommande vivement !',
  },
  {
    id: 2,
    clientName: 'Pierre M.',
    clientCity: 'Yaoundé',
    clientEmoji: '👨‍💼',
    proName: 'Sophie A.',
    proCategory: 'Électricienne',
    proEmoji: '⚡',
    rating: 5,
    comment: 'Sophie a refait toute l\'installation électrique de ma maison. Travail soigné, professionnel et conforme aux normes. Un grand merci !',
  },
  {
    id: 3,
    clientName: 'Aline T.',
    clientCity: 'Bafoussam',
    clientEmoji: '👩‍🦱',
    proName: 'Paul B.',
    proCategory: 'Menuisier',
    proEmoji: '🪚',
    rating: 4,
    comment: 'Très bon travail sur mes placards de cuisine. Délai respecté et finition de qualité. Petit bémol sur le nettoyage après travaux.',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const t = testimonials[current];

  const next = () => setCurrent((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="relative card-bg">
      <div className="container-max section-padding">
        <div className="reveal text-center mb-10">
          <span className="section-label">Témoignages</span>
          <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2">
            Ce que disent nos clients
          </h2>
        </div>

        <div className="reveal reveal-delay-2 grid lg:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          {/* Quote */}
          <div className="relative">
            <Quote className="w-10 h-10 text-[rgba(212,168,83,0.15)] mb-4" />
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < t.rating ? 'text-gold fill-[var(--gold)]' : 'text-ter'}`}
                />
              ))}
            </div>
            <p className="text-lg text-[#E8E8F0] leading-relaxed mb-6">
              "{t.comment}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[rgba(128,128,128,0.12)] flex items-center justify-center text-lg">
                {t.clientEmoji}
              </div>
              <div>
                <div className="font-medium text-pri text-sm">{t.clientName}</div>
                <div className="text-xs text-ter">{t.clientCity}</div>
              </div>
            </div>
          </div>

          {/* Pro card */}
          <div className="card-bg border border-theme rounded-2xl p-6 card-hover">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-[rgba(128,128,128,0.12)] flex items-center justify-center text-2xl">
                {t.proEmoji}
              </div>
              <div>
                <h3 className="font-semibold text-pri">{t.proName}</h3>
                <p className="text-sm text-gold">{t.proCategory}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-sec">
              <div>
                <span className="text-pri font-bold">4.8</span>/5
              </div>
              <div className="w-px h-4 bg-[rgba(128,128,128,0.10)]" />
              <div>48 avis</div>
              <div className="w-px h-4 bg-[rgba(128,128,128,0.10)]" />
              <div className="text-[#2ECC71] text-xs font-medium">Disponible</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-theme flex items-center justify-center text-sec hover:text-pri hover:border-[var(--gold)] transition-all hover:bg-gold-dim"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-[#D4A853] w-6' : 'bg-[rgba(255,255,255,0.15)] w-2 hover:bg-[rgba(255,255,255,0.25)]'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-theme flex items-center justify-center text-sec hover:text-pri hover:border-[var(--gold)] transition-all hover:bg-gold-dim"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
