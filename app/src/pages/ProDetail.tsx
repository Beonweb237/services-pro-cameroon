import { useParams } from 'react-router-dom';
import { Star, MapPin, MessageSquare, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';

const mockPro = {
  id: '1',
  name: 'Jean Kouamé',
  title: 'Plombier — Dépannage et installation sanitaire',
  city: 'Douala',
  region: 'Littoral',
  bio: 'Plombier certifié avec plus de 10 ans d\'expérience à Douala. Spécialisé dans les dépannages urgents, les installations sanitaires et la rénovation de salles de bain. Intervient dans tous les quartiers de Douala sous 24h. Devis gratuit et transparent.',
  proScore: 96,
  avgRating: 4.9,
  totalReviews: 48,
  totalMissions: 127,
  responseRate: 98,
  responseTime: 2,
  hourlyRateMin: 5000,
  hourlyRateMax: 25000,
  yearsExperience: 10,
  languages: ['Français', 'Anglais'],
  primarySkills: ['Plomberie sanitaire', 'Dépannage urgent', 'Installation chauffe-eau', 'Rénovation salle de bain', 'Détection de fuite'],
  level: 'elite',
  badges: [
    { name: 'Identité vérifiée', color: '#2ECC71' },
    { name: 'Diplôme vérifié', color: '#3B82F6' },
    { name: 'Expert', color: '#D4A853' },
  ],
  availability: {
    lundi: true,
    mardi: true,
    mercredi: true,
    jeudi: true,
    vendredi: true,
    samedi: true,
    dimanche: false,
  },
};

const mockReviews = [
  { id: '1', clientName: 'Marie D.', rating: 5, quality: 5, punctuality: 5, communication: 5, value: 5, professionalism: 5, comment: 'Service impeccable ! Jean est arrivé à l\'heure, a résolu mon problème de fuite en moins d\'une heure. Le prix était très raisonnable.', date: '2026-05-15', hasResponse: true, response: 'Merci beaucoup Marie ! C\'était un plaisir de vous aider.' },
  { id: '2', clientName: 'Pierre M.', rating: 5, quality: 5, punctuality: 4, communication: 5, value: 5, professionalism: 5, comment: 'Très professionnel. Travail soigné et conforme aux normes. Je recommande vivement !', date: '2026-04-28', hasResponse: false },
  { id: '3', clientName: 'Sophie L.', rating: 4, quality: 4, punctuality: 5, communication: 4, value: 4, professionalism: 5, comment: 'Bon travail sur l\'installation de ma salle de bain. Délai respecté.', date: '2026-04-10', hasResponse: true, response: 'Merci Sophie pour votre confiance !' },
];

const levelLabels: Record<string, { label: string; color: string }> = {
  starter: { label: 'Starter', color: '#6B6B80' },
  certified: { label: 'Certifié', color: '#3B82F6' },
  expert: { label: 'Expert', color: '#D4A853' },
  elite: { label: 'Elite', color: '#A78BFA' },
  partner: { label: 'Partenaire', color: '#EC4899' },
};

export default function ProDetail() {
  useParams();
  const pro = mockPro;
  const levelInfo = levelLabels[pro.level];
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const dayKeys = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  return (
    <div className="min-h-screen page-bg">
      <Navigation />

      <main className="pt-20 pb-16">
        {/* Cover */}
        <div className="h-48 bg-gradient-to-br from-[#1A1A28] via-[#2A2A38] to-[#14141E] relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,rgba(212,168,83,0.3),transparent_50%)]" />
          <div className="container-max h-full flex items-end pb-4">
            <Link to="/trouver" className="flex items-center gap-2 text-sm text-sec hover:text-pri transition-colors bg-[rgba(0,0,0,0.5)] backdrop-blur-sm px-3 py-1.5 rounded-full">
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Link>
          </div>
        </div>

        <div className="container-max -mt-12 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile header */}
              <div className="card-bg border border-theme rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-[rgba(128,128,128,0.12)] border-3 border-[#D4A853] flex items-center justify-center text-4xl shadow-xl shrink-0">
                    👨‍🔧
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-xl font-bold text-pri">{pro.name}</h1>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-pri"
                        style={{ backgroundColor: levelInfo.color }}
                      >
                        {levelInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-gold mb-2">{pro.title}</p>
                    <div className="flex items-center gap-1 text-xs text-ter">
                      <MapPin className="w-3 h-3" />
                      {pro.city}, {pro.region}
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {pro.badges.map((badge, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full text-pri"
                      style={{ backgroundColor: `${badge.color}30`, color: badge.color }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {badge.name}
                    </span>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-gold">{pro.proScore}</div>
                    <div className="text-[10px] text-ter">Pro Score</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-pri flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-gold fill-[var(--gold)]" />
                      {pro.avgRating}
                    </div>
                    <div className="text-[10px] text-ter">{pro.totalReviews} avis</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-pri">{pro.totalMissions}</div>
                    <div className="text-[10px] text-ter">Missions</div>
                  </div>
                  <div className="bg-[rgba(255,255,255,0.02)] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-[#2ECC71]">{pro.responseRate}%</div>
                    <div className="text-[10px] text-ter">Taux réponse</div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="card-bg border border-theme rounded-2xl p-6">
                <h2 className="text-base font-semibold text-pri mb-3">À propos</h2>
                <p className="text-sm text-sec leading-relaxed">{pro.bio}</p>
              </div>

              {/* Skills */}
              <div className="card-bg border border-theme rounded-2xl p-6">
                <h2 className="text-base font-semibold text-pri mb-3">Compétences</h2>
                <div className="flex flex-wrap gap-2">
                  {pro.primarySkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full text-xs bg-gold-dim text-gold border border-[var(--gold-dim)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="card-bg border border-theme rounded-2xl p-6">
                <h2 className="text-base font-semibold text-pri mb-4">Avis clients ({pro.totalReviews})</h2>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b border-[rgba(255,255,255,0.04)] pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[rgba(128,128,128,0.12)] flex items-center justify-center text-sm">
                            👤
                          </div>
                          <div>
                            <div className="text-sm font-medium text-pri">{review.clientName}</div>
                            <div className="text-[10px] text-ter">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating ? 'text-gold fill-[var(--gold)]' : 'text-ter'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-sec mb-2">{review.comment}</p>
                      {review.hasResponse && (
                        <div className="ml-4 pl-3 border-l-2 border-[var(--gold-dim)]">
                          <p className="text-xs text-gold">{review.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Contact card */}
              <div className="card-bg border border-theme rounded-2xl p-6 sticky top-24">
                <div className="mb-4">
                  <div className="text-xs text-ter mb-1">Tarif horaire</div>
                  <div className="text-lg font-bold text-pri">
                    {pro.hourlyRateMin.toLocaleString()} - {pro.hourlyRateMax.toLocaleString()}{' '}
                    <span className="text-sm text-ter">XAF</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-ter mb-1">Disponibilités</div>
                  <div className="flex gap-1.5">
                    {days.map((day, i) => (
                      <div
                        key={day + i}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                          pro.availability[dayKeys[i] as keyof typeof pro.availability]
                            ? 'bg-[rgba(46,204,113,0.15)] text-[#2ECC71]'
                            : 'bg-[rgba(128,128,128,0.06)] text-ter'
                        }`}
                      >
                        {day}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="text-xs text-ter mb-1">Langues</div>
                  <div className="text-sm text-sec">{pro.languages.join(', ')}</div>
                </div>

                <button className="w-full btn-gold flex items-center justify-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4" />
                  Contacter
                </button>
                <button className="w-full btn-outline text-sm">
                  Demander un devis
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
