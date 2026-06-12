import { prisma } from '../utils/prisma';

/**
 * Calcule le Pro Score pondéré avec décote temporelle
 * 
 * Formule:
 * Score_brut = (Q×0.30) + (Po×0.20) + (C×0.20) + (V×0.20) + (Pro×0.10)
 * Score_pondéré = Σ(Score_avis_i × Poids_temporel_i) / Σ(Poids_temporel_i)
 * Pro Score = round(Score_pondéré × 20)  [conversion ★/5 → /100]
 * 
 * Pondération temporelle:
 * 0–3 mois: 100%
 * 3–6 mois: 80%
 * 6–12 mois: 60%
 * 12–24 mois: 40%
 * >24 mois: 20%
 */

const CRITERIA_WEIGHTS = {
  quality: 0.30,
  punctuality: 0.20,
  communication: 0.20,
  value: 0.20,
  professionalism: 0.10,
};

const getTemporalWeight = (reviewDate: Date): number => {
  const now = new Date();
  const monthsDiff = (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsDiff <= 3) return 1.0;
  if (monthsDiff <= 6) return 0.8;
  if (monthsDiff <= 12) return 0.6;
  if (monthsDiff <= 24) return 0.4;
  return 0.2;
};

export const calculateProScore = async (proId: string): Promise<number> => {
  const reviews = await prisma.review.findMany({
    where: {
      proId,
      moderationStatus: 'approved',
    },
    select: {
      qualityScore: true,
      punctualityScore: true,
      communicationScore: true,
      valueScore: true,
      professionalismScore: true,
      createdAt: true,
    },
  });

  if (reviews.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (const review of reviews) {
    const temporalWeight = getTemporalWeight(review.createdAt);
    
    const rawScore =
      review.qualityScore * CRITERIA_WEIGHTS.quality +
      review.punctualityScore * CRITERIA_WEIGHTS.punctuality +
      review.communicationScore * CRITERIA_WEIGHTS.communication +
      review.valueScore * CRITERIA_WEIGHTS.value +
      review.professionalismScore * CRITERIA_WEIGHTS.professionalism;

    weightedSum += rawScore * temporalWeight;
    totalWeight += temporalWeight;
  }

  if (totalWeight === 0) return 0;

  const weightedAverage = weightedSum / totalWeight;
  const proScore = Math.round(weightedAverage * 20); // Conversion /5 → /100

  return Math.min(100, Math.max(0, proScore));
};

/**
 * Met à jour le Pro Score d'un professionnel et vérifie les changements de niveau
 */
export const updateProScoreAndLevel = async (proId: string): Promise<void> => {
  const proScore = await calculateProScore(proId);

  const pro = await prisma.proProfile.findUnique({
    where: { id: proId },
    include: {
      reviews: {
        where: { moderationStatus: 'approved' },
        select: { overallScore: true },
      },
      _count: {
        select: { 
          reviews: { where: { moderationStatus: 'approved' } },
          missions: { where: { status: 'completed' } },
        },
      },
    },
  });

  if (!pro) return;

  const avgRating = pro.reviews.length > 0
    ? pro.reviews.reduce((sum, r) => sum + (r.overallScore || 0), 0) / pro.reviews.length
    : 0;

  // Déterminer le niveau
  let newLevel = pro.level;
  const completedMissions = pro._count.missions;
  const approvedReviews = pro._count.reviews;

  // Vérifier les conditions de niveau
  if (completedMissions >= 100 && proScore >= 94 && pro.level !== 'partner') {
    newLevel = 'elite';
  } else if (completedMissions >= 20 && proScore >= 84 && pro.level !== 'elite' && pro.level !== 'partner') {
    newLevel = 'expert';
  } else if (pro.isIdentityVerified && approvedReviews >= 3 && pro.level === 'starter') {
    newLevel = 'certified';
  }

  await prisma.proProfile.update({
    where: { id: proId },
    data: {
      proScore,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: approvedReviews,
      totalMissions: completedMissions,
      level: newLevel,
    },
  });
};

/**
 * Vérifie si un pro peut passer au niveau suivant
 */
export const checkLevelEligibility = (
  currentLevel: string,
  proScore: number,
  completedMissions: number,
  approvedReviews: number,
  isIdentityVerified: boolean,
  complaintCount: number
): { canLevelUp: boolean; nextLevel: string | null } => {
  switch (currentLevel) {
    case 'starter':
      if (isIdentityVerified && approvedReviews >= 3) {
        return { canLevelUp: true, nextLevel: 'certified' };
      }
      break;
    case 'certified':
      if (completedMissions >= 20 && proScore >= 84) {
        return { canLevelUp: true, nextLevel: 'expert' };
      }
      break;
    case 'expert':
      if (completedMissions >= 100 && proScore >= 94 && complaintCount === 0) {
        return { canLevelUp: true, nextLevel: 'elite' };
      }
      break;
    case 'elite':
      return { canLevelUp: false, nextLevel: 'partner' }; // Partenaire = manuel
  }

  return { canLevelUp: false, nextLevel: null };
};
