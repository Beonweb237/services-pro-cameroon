import { Link } from 'react-router-dom';
import { Scale, Calculator, HeartPulse, HardHat, Code, Megaphone, GraduationCap, Building2, Sparkles, Leaf } from 'lucide-react';

const families = [
  { name: 'Juridique & Légal', color: '#6366F1', icon: Scale, count: 45, description: 'Avocats, notaires, huissiers' },
  { name: 'Financier & Comptable', color: '#10B981', icon: Calculator, count: 67, description: 'Comptables, conseillers fiscaux' },
  { name: 'Médical & Santé', color: '#EF4444', icon: HeartPulse, count: 89, description: 'Médecins, infirmiers' },
  { name: 'Architecture & BTP', color: '#F59E0B', icon: HardHat, count: 234, description: 'Plombiers, électriciens' },
  { name: 'Numérique & Technologie', color: '#3B82F6', icon: Code, count: 156, description: 'Développeurs, designers' },
  { name: 'Communication & Créativité', color: '#EC4899', icon: Megaphone, count: 78, description: 'Graphistes, photographes' },
  { name: 'Éducatif & Formation', color: '#8B5CF6', icon: GraduationCap, count: 56, description: 'Enseignants, coachs' },
  { name: 'Services aux Entreprises', color: '#14B8A6', icon: Building2, count: 92, description: 'Consultants, traducteurs' },
  { name: 'Bien-être & Personne', color: '#F97316', icon: Sparkles, count: 187, description: 'Coiffeurs, esthéticiens' },
  { name: 'Environnement & Technique', color: '#22C55E', icon: Leaf, count: 73, description: 'Climatisation, jardinage' },
];

export default function Families() {
  return (
    <section className="relative page-bg">
      <div className="container-max section-padding">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-gold tracking-wider uppercase">
            10 domaines
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-pri mt-2">
            Familles de Services
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {families.map((family) => (
            <Link
              key={family.name}
              to={`/familles`}
              className="group card-bg border border-theme rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
              style={{ 
                borderColor: 'rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${family.color}50`;
                (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 30px ${family.color}20`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${family.color}15` }}
              >
                <family.icon className="w-5 h-5" style={{ color: family.color }} />
              </div>
              <h3 className="text-sm font-semibold text-pri mb-1">{family.name}</h3>
              <p className="text-xs text-ter mb-2">{family.description}</p>
              <span className="text-xs font-medium" style={{ color: family.color }}>
                {family.count} pros
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
