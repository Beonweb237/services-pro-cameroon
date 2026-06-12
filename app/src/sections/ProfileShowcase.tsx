import { Star, MessageSquare, Calendar, MapPin, Award, CheckCircle } from 'lucide-react';

const mockPro = {
  id: 'showcase-1',
  name: 'Jean Kouamé',
  title: 'Plombier — Dépannage et installation',
  city: 'Douala',
  bio: 'Plombier certifié avec plus de 10 ans d\'expérience à Douala. Spécialisé dans les dépannages urgents, les installations sanitaires et la rénovation de salles de bain. Intervient dans tous les quartiers de Douala sous 24h.',
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
  primarySkills: ['Plomberie sanitaire', 'Dépannage urgent', 'Installation chauffe-eau', 'Rénovation salle de bain'],
  level: 'elite',
  badges: [
    { name: 'Identité vérifiée', icon: CheckCircle, color: '#2ECC71' },
    { name: 'Expert', icon: Award, color: '#D4A853' },
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

export default function ProfileShowcase() {
  const pro = mockPro;
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const dayKeys = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  return (
    <section className="relative card-bg">
      <div className="container-max section-padding">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-gold tracking-wider uppercase">
            Profil pro
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2">
            Un profil qui met en valeur votre expertise
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="card-bg border border-theme rounded-2xl overflow-hidden">
            {/* Cover */}
            <div className="h-40 bg-gradient-to-br from-[var(--bg-elevated)] via-[var(--bg-hover)] to-[var(--bg-elevated)] relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,var(--gold-dim),transparent_50%)]" />
            </div>

            {/* Profile header */}
            <div className="px-6 pb-6">
              <div className="relative flex flex-col sm:flex-row items-start gap-4 -mt-12 mb-4">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-[rgba(128,128,128,0.12)] border-3 border-[#0A0A0F] flex items-center justify-center text-4xl shadow-xl shrink-0"
                  style={{ borderWidth: 3, borderColor: '#D4A853' }}>
                  👨‍🔧
                </div>

                <div className="flex-1 pt-2">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-pri">{pro.name}</h3>
                    {pro.badges.map((badge, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-pri"
                        style={{ backgroundColor: badge.color }}
                      >
                        <badge.icon className="w-3 h-3" />
                        {badge.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gold mb-1">{pro.title}</p>
                  <div className="flex items-center gap-1 text-xs text-ter">
                    <MapPin className="w-3 h-3" />
                    {pro.city}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-theme">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full border-2 border-[#D4A853] flex items-center justify-center">
                    <span className="text-xs font-bold text-gold">{pro.proScore}</span>
                  </div>
                  <div className="text-xs text-ter">Pro Score</div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-gold fill-[var(--gold)]" />
                  <span className="text-sm text-pri font-medium">{pro.avgRating}</span>
                  <span className="text-xs text-ter">({pro.totalReviews} avis)</span>
                </div>
                <div className="text-xs text-ter">
                  {pro.totalMissions} missions
                </div>
                <div className="text-xs text-[#2ECC71]">
                  Répond en {pro.responseTime}h
                </div>
              </div>

              {/* Bio */}
              <p className="text-sm text-sec leading-relaxed mb-4">
                {pro.bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {pro.primarySkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs bg-gold-dim text-gold border border-[var(--gold-dim)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Availability */}
              <div className="mb-4">
                <div className="text-xs text-ter mb-2 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Disponibilités
                </div>
                <div className="flex gap-2">
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

              {/* Price */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-xs text-ter">Tarif horaire</span>
                  <div className="text-sm text-pri font-medium">
                    {pro.hourlyRateMin.toLocaleString()} - {pro.hourlyRateMax.toLocaleString()} XAF
                  </div>
                </div>
                <div className="text-xs text-ter">
                  {pro.yearsExperience} ans d'expérience
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <button className="btn-gold flex-1 flex items-center justify-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4" />
                  Contacter
                </button>
                <button className="btn-outline flex-1 text-sm">
                  Demander un devis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
