import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, TrendingUp, Star, MessageSquare, Shield, Headphones } from 'lucide-react';

const benefits = [
  { icon: Shield, text: 'Profil vérifié et badge de confiance' },
  { icon: TrendingUp, text: 'Accès à des milliers de clients' },
  { icon: MessageSquare, text: 'Messagerie sécurisée intégrée' },
  { icon: Star, text: 'Paiements protégés (Phase 2)' },
  { icon: Headphones, text: 'Support prioritaire 24/7' },
];

export default function CTA() {
  return (
    <section className="relative page-bg overflow-hidden">
      {/* Gradient radial doré */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 65%)', filter: 'blur(60px)' }}
        />
      </div>

      <div className="container-max section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div className="reveal space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-pri leading-tight">
              Rejoignez <span className="gold-text-gradient">Services Pro</span> dès aujourd'hui
            </h2>
            <p className="text-sec leading-relaxed">
              Que vous soyez un professionnel à la recherche de nouveaux clients ou un particulier
              cherchant un service de qualité, Services Pro Cameroon est la plateforme qu'il vous faut.
            </p>

            <div className="space-y-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-4.5 h-4.5 text-[#2ECC71] shrink-0" style={{ width: 18, height: 18 }} />
                  <span className="text-sm text-sec">{b.text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/inscription/pro" className="btn-gold inline-flex items-center gap-2 text-sm">
                Devenir un Pro
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/trouver" className="btn-outline inline-flex items-center gap-2 text-sm">
                Trouver un Pro
              </Link>
            </div>
          </div>

          {/* Right : Phone mockup */}
          <div className="reveal reveal-delay-3 flex justify-center">
            <div className="relative w-[260px] h-[500px] card-bg rounded-[40px] border-[3px] border-[#2A2A38] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-pulse-glow">
              <div className="absolute inset-[3px] page-bg rounded-[36px] overflow-hidden">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 card-bg rounded-b-xl z-10" />

                <div className="pt-8 px-4 h-full">
                  <div className="text-center mb-4">
                    <div className="text-base font-bold text-pri">
                      Services <span className="text-gold">Pro</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Pro Score */}
                    <div className="card-bg rounded-xl p-3 border border-theme">
                      <div className="text-[10px] text-ter mb-1.5">Pro Score</div>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full border-2 border-[#D4A853] flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-gold">87</span>
                        </div>
                        <div className="flex-1">
                          <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                            <div className="h-full w-[87%] bg-gradient-to-r from-[#D4A853] to-[#E8C87A] rounded-full" />
                          </div>
                          <div className="text-[9px] text-[#2ECC71] mt-1">Excellent ! +3 pts ce mois</div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="card-bg rounded-xl p-3 text-center border border-theme">
                        <div className="text-lg font-bold text-pri">12</div>
                        <div className="text-[9px] text-ter">Missions ce mois</div>
                      </div>
                      <div className="card-bg rounded-xl p-3 text-center border border-theme">
                        <div className="text-lg font-bold text-gold">4.8</div>
                        <div className="text-[9px] text-ter">Note moyenne</div>
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="card-bg rounded-xl p-3 space-y-2 border border-theme">
                      <div className="text-[10px] text-ter">Notifications</div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gold-dim flex items-center justify-center text-xs shrink-0">
                          💬
                        </div>
                        <div className="text-[10px] text-sec">Nouveau message de Marie D.</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[rgba(46,204,113,0.1)] flex items-center justify-center text-xs shrink-0">
                          ⭐
                        </div>
                        <div className="text-[10px] text-sec">Nouvel avis 5 étoiles !</div>
                      </div>
                    </div>

                    {/* Bottom nav */}
                    <div className="flex justify-around pt-2 pb-4">
                      {['🏠', '🔍', '💬', '👤'].map((icon, i) => (
                        <div key={i} className={`text-lg ${i === 0 ? 'opacity-100' : 'opacity-30'}`}>
                          {icon}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
