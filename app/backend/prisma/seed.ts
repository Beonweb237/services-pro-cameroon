import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ========== VILLES ==========
  const cities = [
    { name: 'Douala', slug: 'douala', region: 'Littoral', population: 4500000, phase: 1, topCategories: ['plomberie', 'electricite', 'coiffure'] },
    { name: 'Yaoundé', slug: 'yaounde', region: 'Centre', population: 4000000, phase: 1, topCategories: ['electricite', 'avocat', 'developpeur-web'] },
    { name: 'Bafoussam', slug: 'bafoussam', region: 'Ouest', population: 400000, phase: 1, topCategories: ['menuiserie', 'maconnerie', 'electricite'] },
    { name: 'Garoua', slug: 'garoua', region: 'Nord', population: 500000, phase: 2, topCategories: ['plomberie', 'maconnerie', 'climatisation'] },
    { name: 'Bamenda', slug: 'bamenda', region: 'Nord-Ouest', population: 500000, phase: 2, topCategories: ['electricite', 'informatique', 'coiffure'] },
    { name: 'Ngaoundéré', slug: 'ngaoundere', region: 'Adamaoua', population: 300000, phase: 2, topCategories: ['plomberie', 'menuiserie', 'jardinage'] },
    { name: 'Maroua', slug: 'maroua', region: 'Extrême-Nord', population: 450000, phase: 2, topCategories: ['electricite', 'maconnerie', 'peinture'] },
    { name: 'Bertoua', slug: 'bertoua', region: 'Est', population: 250000, phase: 2, topCategories: ['plomberie', 'menuiserie', 'nettoyage'] },
    { name: 'Ebolowa', slug: 'ebolowa', region: 'Sud', population: 150000, phase: 3, topCategories: ['electricite', 'coiffure', 'cuisine'] },
    { name: 'Buea', slug: 'buea', region: 'Sud-Ouest', population: 300000, phase: 3, topCategories: ['developpeur-web', 'design-graphique', 'photographie'] },
    { name: 'Kribi', slug: 'kribi', region: 'Sud', population: 100000, phase: 3, topCategories: ['plomberie', 'climatisation', 'jardinage'] },
    { name: 'Limbe', slug: 'limbe', region: 'Sud-Ouest', population: 200000, phase: 3, topCategories: ['electricite', 'menuiserie', 'peinture'] },
    { name: 'Edéa', slug: 'edea', region: 'Littoral', population: 150000, phase: 3, topCategories: ['plomberie', 'maconnerie', 'ferronnerie'] },
    { name: 'Kumba', slug: 'kumba', region: 'Sud-Ouest', population: 300000, phase: 3, topCategories: ['electricite', 'coiffure', 'couture'] },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {},
      create: city,
    });
  }
  console.log(`✅ ${cities.length} villes créées`);

  // ========== FAMILLES DE SERVICES ==========
  const families = [
    { name: 'Juridique & Légal', slug: 'juridique-legal', color: '#6366F1', icon: 'Scale', description: 'Avocats, notaires, huissiers et experts juridiques', order: 1 },
    { name: 'Financier & Comptable', slug: 'financier-comptable', color: '#10B981', icon: 'Calculator', description: 'Comptables, conseillers fiscaux et auditeurs', order: 2 },
    { name: 'Médical & Santé', slug: 'medical-sante', color: '#EF4444', icon: 'HeartPulse', description: 'Médecins, infirmiers, kinésithérapeutes', order: 3 },
    { name: 'Architecture & BTP', slug: 'architecture-btp', color: '#F59E0B', icon: 'HardHat', description: 'Architectes, plombiers, électriciens, maçons', order: 4 },
    { name: 'Numérique & Technologie', slug: 'numerique-technologie', color: '#3B82F6', icon: 'Code', description: 'Développeurs, designers, experts SEO', order: 5 },
    { name: 'Communication & Créativité', slug: 'communication-creativite', color: '#EC4899', icon: 'Megaphone', description: 'Graphistes, rédacteurs, photographes', order: 6 },
    { name: 'Éducatif & Formation', slug: 'educatif-formation', color: '#8B5CF6', icon: 'GraduationCap', description: 'Enseignants, coachs, formateurs', order: 7 },
    { name: 'Services aux Entreprises', slug: 'services-entreprises', color: '#14B8A6', icon: 'Building2', description: 'Consultants RH, experts qualité, traducteurs', order: 8 },
    { name: 'Bien-être & Personne', slug: 'bien-etre-personne', color: '#F97316', icon: 'Sparkles', description: 'Coach sportif, coiffeurs, esthéticiens', order: 9 },
    { name: 'Environnement & Technique', slug: 'environnement-technique', color: '#22C55E', icon: 'Leaf', description: 'Climatisation, énergies renouvelables', order: 10 },
  ];

  for (const family of families) {
    await prisma.serviceFamily.upsert({
      where: { slug: family.slug },
      update: {},
      create: family,
    });
  }
  console.log(`✅ ${families.length} familles de services créées`);

  // ========== CATÉGORIES ==========
  const familyMap: Record<string, string> = {};
  for (const f of families) {
    const dbFamily = await prisma.serviceFamily.findUnique({ where: { slug: f.slug } });
    if (dbFamily) familyMap[f.slug] = dbFamily.id;
  }

  const categories = [
    { name: 'Plomberie', slug: 'plomberie', familySlug: 'architecture-btp', order: 1 },
    { name: 'Électricité', slug: 'electricite', familySlug: 'architecture-btp', order: 2 },
    { name: 'Menuiserie', slug: 'menuiserie', familySlug: 'architecture-btp', order: 3 },
    { name: 'Maçonnerie', slug: 'maconnerie', familySlug: 'architecture-btp', order: 4 },
    { name: 'Peinture', slug: 'peinture', familySlug: 'architecture-btp', order: 5 },
    { name: 'Jardinage', slug: 'jardinage', familySlug: 'environnement-technique', order: 6 },
    { name: 'Coiffure & Beauté', slug: 'coiffure-beaute', familySlug: 'bien-etre-personne', order: 7 },
    { name: 'Couture', slug: 'couture', familySlug: 'bien-etre-personne', order: 8 },
    { name: 'Mécanique Auto', slug: 'mecanique-auto', familySlug: 'environnement-technique', order: 9 },
    { name: 'Informatique', slug: 'informatique', familySlug: 'numerique-technologie', order: 10 },
    { name: 'Design Graphique', slug: 'design-graphique', familySlug: 'communication-creativite', order: 11 },
    { name: 'Photographie', slug: 'photographie', familySlug: 'communication-creativite', order: 12 },
    { name: 'Cuisine & Traiteur', slug: 'cuisine-traiteur', familySlug: 'bien-etre-personne', order: 13 },
    { name: 'Nettoyage', slug: 'nettoyage', familySlug: 'services-entreprises', order: 14 },
    { name: 'Déménagement', slug: 'demenagement', familySlug: 'services-entreprises', order: 15 },
    { name: 'Climatisation', slug: 'climatisation', familySlug: 'environnement-technique', order: 16 },
    { name: 'Ferronnerie', slug: 'ferronnerie', familySlug: 'architecture-btp', order: 17 },
    { name: 'Carrelage', slug: 'carrelage', familySlug: 'architecture-btp', order: 18 },
    { name: 'Électronique', slug: 'electronique', familySlug: 'numerique-technologie', order: 19 },
    { name: 'Conseil & Gestion', slug: 'conseil-gestion', familySlug: 'services-entreprises', order: 20 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        familyId: familyMap[cat.familySlug],
        order: cat.order,
      },
    });
  }
  console.log(`✅ ${categories.length} catégories créées`);

  // ========== PLANS TARIFAIRES ==========
  const plans = [
    {
      name: 'Gratuit',
      slug: 'gratuit',
      priceXaf: 0,
      commissionPercent: 15,
      contactsLimit: 5,
      boostsPerMonth: 0,
      features: [
        { name: 'Profil basique', included: true },
        { name: '5 contacts/mois', included: true },
        { name: 'Commission 15%', included: true },
        { name: 'Statistiques basiques', included: true },
        { name: 'Support standard', included: true },
        { name: 'Contacts illimités', included: false },
        { name: 'Boost de visibilité', included: false },
        { name: 'Statistiques avancées', included: false },
      ],
      description: 'Parfait pour débuter et tester la plateforme',
      order: 1,
    },
    {
      name: 'Pro',
      slug: 'pro',
      priceXaf: 15000,
      commissionPercent: 10,
      contactsLimit: 0,
      boostsPerMonth: 1,
      features: [
        { name: 'Profil complet', included: true },
        { name: 'Contacts illimités', included: true },
        { name: 'Commission 10%', included: true },
        { name: 'Statistiques avancées', included: true },
        { name: 'Support prioritaire', included: true },
        { name: '1 boost/mois', included: true },
        { name: 'Badge Pro', included: true },
        { name: 'Conseiller dédié', included: false },
      ],
      description: 'Pour les professionnels actifs',
      isPopular: true,
      order: 2,
    },
    {
      name: 'Expert',
      slug: 'expert',
      priceXaf: 35000,
      commissionPercent: 7,
      contactsLimit: 0,
      boostsPerMonth: 2,
      features: [
        { name: 'Profil complet', included: true },
        { name: 'Contacts illimités', included: true },
        { name: 'Commission 7%', included: true },
        { name: 'Statistiques complètes', included: true },
        { name: 'Support 24h', included: true },
        { name: '2 boosts/mois', included: true },
        { name: 'Badge Expert', included: true },
        { name: 'Visibilité prioritaire', included: true },
      ],
      description: 'Pour les experts confirmés',
      order: 3,
    },
    {
      name: 'Elite',
      slug: 'elite',
      priceXaf: 75000,
      commissionPercent: 5,
      contactsLimit: 0,
      boostsPerMonth: 0,
      features: [
        { name: 'Profil premium', included: true },
        { name: 'Contacts illimités', included: true },
        { name: 'Commission 5%', included: true },
        { name: 'Statistiques complètes', included: true },
        { name: 'Conseiller dédié', included: true },
        { name: 'Boosts illimités', included: true },
        { name: 'Badge Elite', included: true },
        { name: 'Accès anticipé', included: true },
      ],
      description: 'Sur invitation uniquement',
      order: 4,
    },
  ];

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { slug: plan.slug },
      update: {},
      create: plan,
    });
  }
  console.log(`✅ ${plans.length} plans tarifaires créés`);

  // ========== FAQS ==========
  const faqs = [
    { question: 'Comment fonctionne Services Pro Cameroon ?', answer: 'Services Pro Cameroon est une plateforme qui met en relation des clients avec des professionnels vérifiés au Cameroun. Recherchez un service, comparez les profils et contactez le pro de votre choix via notre messagerie sécurisée.', category: 'general', order: 1 },
    { question: 'Les professionnels sont-ils vérifiés ?', answer: 'Oui, tous nos professionnels passent par un processus de vérification. Nous vérifions leur identité (CNI ou passeport) et leurs qualifications. Les pros vérifiés portent un badge "Identité vérifiée" sur leur profil.', category: 'general', order: 2 },
    { question: 'Comment est calculé le Pro Score ?', answer: 'Le Pro Score est un score composite de 0 à 100 calculé sur 5 critères pondérés : qualité du travail (30%), ponctualité (20%), communication (20%), rapport qualité/prix (20%) et professionnalisme (10%). Les avis récents comptent plus que les anciens.', category: 'general', order: 3 },
    { question: 'Comment déposer un avis ?', answer: 'Vous pouvez déposer un avis après avoir complété une mission avec un professionnel. Le dépôt est possible entre 72 heures et 30 jours après la fin de la mission. Vous notez 5 critères et pouvez laisser un commentaire.', category: 'client', order: 1 },
    { question: 'La plateforme est-elle gratuite pour les clients ?', answer: 'Oui, l\'inscription et l\'utilisation de la plateforme sont entièrement gratuites pour les clients. Vous pouvez rechercher, comparer et contacter les professionnels sans frais.', category: 'client', order: 2 },
    { question: 'Comment devenir professionnel sur la plateforme ?', answer: 'Inscrivez-vous en tant que professionnel, complétez votre profil (min. 60%), téléchargez votre pièce d\'identité et attendez la validation sous 24-48h. Vous pourrez ensuite recevoir des demandes de clients.', category: 'pro', order: 1 },
    { question: 'Quels sont les plans tarifaires ?', answer: 'Nous proposons 4 plans : Gratuit (0 FCFA, 15% commission), Pro (15 000 FCFA/mois, 10%), Expert (35 000 FCFA/mois, 7%) et Elite (75 000 FCFA/mois, 5%, sur invitation).', category: 'pricing', order: 1 },
    { question: 'Comment fonctionne la messagerie ?', answer: 'Notre messagerie interne permet d\'échanger avec les professionnels. Pour votre sécurité, le partage de coordonnées directes (téléphone, email) est détecté et vous êtes invité à utiliser la messagerie de la plateforme.', category: 'security', order: 1 },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log(`✅ ${faqs.length} FAQs créées`);

  // ========== BADGES ==========
  const badges = [
    { name: 'Nouveau', slug: 'nouveau', description: 'Bienvenue sur Services Pro', icon: 'Star', color: '#6B6B80' },
    { name: 'Identité vérifiée', slug: 'identite-verifiee', description: 'Identité confirmée par la plateforme', icon: 'BadgeCheck', color: '#3B82F6' },
    { name: 'Expert', slug: 'expert', description: '20 missions complétées avec succès', icon: 'Crown', color: '#D4A853' },
    { name: 'Elite', slug: 'elite', description: '100 missions, score 94+', icon: 'Gem', color: '#A78BFA' },
    { name: 'Top Répondeur', slug: 'top-repondeur', description: 'Taux de réponse > 90%', icon: 'Zap', color: '#2ECC71' },
    { name: 'Fidélité', slug: 'fidelite', description: 'Plus de 30% de clients récurrents', icon: 'Heart', color: '#EC4899' },
    { name: 'Rising Star', slug: 'rising-star', description: '+100 points en 30 jours', icon: 'TrendingUp', color: '#F97316' },
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { slug: badge.slug },
      update: {},
      create: badge,
    });
  }
  console.log(`✅ ${badges.length} badges créés`);

  // ========== TÉMOIGNAGES ==========
  const testimonials = [
    { clientName: 'Marie D.', clientCity: 'Douala', proName: 'Jean K.', proCategory: 'Plombier', rating: 5, comment: 'Service impeccable ! Jean est arrivé à l\'heure, a résolu mon problème de fuite en moins d\'une heure. Le prix était très raisonnable. Je recommande vivement !', order: 1 },
    { clientName: 'Pierre M.', clientCity: 'Yaoundé', proName: 'Sophie A.', proCategory: 'Électricienne', rating: 5, comment: 'Sophie a refait toute l\'installation électrique de ma maison. Travail soigné, professionnel et conforme aux normes. Un grand merci !', order: 2 },
    { clientName: 'Aline T.', clientCity: 'Bafoussam', proName: 'Paul B.', proCategory: 'Menuisier', rating: 4, comment: 'Très bon travail sur mes placards de cuisine. Délai respecté et finition de qualité. Petit bémol sur le nettoyage après travaux.', order: 3 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`✅ ${testimonials.length} témoignages créés`);

  console.log('\n✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
