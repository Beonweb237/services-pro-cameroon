import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import { updateProScoreAndLevel } from '../services/proScore.service';
import type { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Créer un avis
router.post('/', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const schema = z.object({
    proId: z.string(),
    missionId: z.string().optional(),
    qualityScore: z.number().min(1).max(5),
    punctualityScore: z.number().min(1).max(5),
    communicationScore: z.number().min(1).max(5),
    valueScore: z.number().min(1).max(5),
    professionalismScore: z.number().min(1).max(5),
    comment: z.string().max(2000).optional(),
  });

  const data = schema.parse(req.body);
  const clientId = req.user!.id;

  // Vérifier que le client a une mission complétée avec ce pro
  if (data.missionId) {
    const mission = await prisma.mission.findFirst({
      where: {
        id: data.missionId,
        client: { userId: clientId },
        proId: data.proId,
        status: 'completed',
      },
    });

    if (!mission) {
      throw new AppError('Vous ne pouvez noter que après une mission complétée', 403);
    }

    // Vérifier le délai 72h - 30j
    const now = new Date();
    const completedAt = mission.completedAt;
    if (completedAt) {
      const hoursDiff = (now.getTime() - completedAt.getTime()) / (1000 * 60 * 60);
      if (hoursDiff < 72) {
        throw new AppError('Vous devez attendre 72h après la fin de la mission', 403);
      }
      if (hoursDiff > 30 * 24) {
        throw new AppError('Le délai de 30 jours pour déposer un avis est dépassé', 403);
      }
    }

    // Vérifier qu'un avis n'existe pas déjà pour cette mission
    const existing = await prisma.review.findFirst({
      where: { missionId: data.missionId },
    });
    if (existing) {
      throw new AppError('Un avis existe déjà pour cette mission', 409);
    }
  }

  // Calculer le score global pondéré
  const overallScore =
    data.qualityScore * 0.30 +
    data.punctualityScore * 0.20 +
    data.communicationScore * 0.20 +
    data.valueScore * 0.20 +
    data.professionalismScore * 0.10;

  const review = await prisma.review.create({
    data: {
      proId: data.proId,
      clientId,
      missionId: data.missionId,
      qualityScore: data.qualityScore,
      punctualityScore: data.punctualityScore,
      communicationScore: data.communicationScore,
      valueScore: data.valueScore,
      professionalismScore: data.professionalismScore,
      overallScore,
      comment: data.comment,
      isVerified: !!data.missionId,
      moderationStatus: 'approved', // Auto-approuvé si mission vérifiée
    },
  });

  // Mettre à jour le Pro Score
  await updateProScoreAndLevel(data.proId);

  // Créer une notification pour le pro
  await prisma.notification.create({
    data: {
      userId: data.proId,
      type: 'new_review',
      title: 'Nouvel avis reçu',
      content: `Vous avez reçu un nouvel avis de ${overallScore.toFixed(1)}/5`,
      data: { reviewId: review.id, proId: data.proId },
    },
  });

  res.status(201).json({ success: true, data: review });
}));

// Liste des avis d'un pro
router.get('/pro/:proId', asyncHandler(async (req, res) => {
  const { proId } = req.params;
  const { page = '1', limit = '10' } = req.query;

  const reviews = await prisma.review.findMany({
    where: {
      proId,
      moderationStatus: 'approved',
    },
    include: {
      client: { select: { id: true, avatar: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    skip: (parseInt(page as string) - 1) * parseInt(limit as string),
    take: parseInt(limit as string),
  });

  // Calculer les stats par critère
  const stats = await prisma.review.groupBy({
    by: ['proId'],
    where: { proId, moderationStatus: 'approved' },
    _avg: {
      qualityScore: true,
      punctualityScore: true,
      communicationScore: true,
      valueScore: true,
      professionalismScore: true,
      overallScore: true,
    },
    _count: { id: true },
  });

  res.json({
    success: true,
    data: reviews,
    stats: stats[0] || null,
  });
}));

// Répondre à un avis
router.put('/:id/response', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { response } = z.object({ response: z.string().min(1).max(1000) }).parse(req.body);

  const review = await prisma.review.findUnique({
    where: { id },
    include: { pro: { include: { user: true } } },
  });

  if (!review) throw new AppError('Avis non trouvé', 404);
  if (review.pro.user.id !== req.user!.id) {
    throw new AppError('Non autorisé', 403);
  }
  if (review.proResponse) {
    throw new AppError('Vous avez déjà répondu à cet avis', 409);
  }

  const updated = await prisma.review.update({
    where: { id },
    data: { proResponse: response, proResponseAt: new Date() },
  });

  res.json({ success: true, data: updated });
}));

// Signaler un avis
router.post('/:id/report', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { reason, description } = z.object({
    reason: z.string(),
    description: z.string().optional(),
  }).parse(req.body);

  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new AppError('Avis non trouvé', 404);

  const report = await prisma.report.create({
    data: {
      reporterId: req.user!.id,
      targetId: id,
      targetType: 'review',
      reason,
      description,
      reviewId: id,
    },
  });

  res.status(201).json({ success: true, data: report });
}));

export default router;
