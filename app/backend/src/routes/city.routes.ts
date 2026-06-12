import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Liste des 14 villes
router.get('/', asyncHandler(async (_req, res) => {
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { 
          neighborhoods: true,
          pros: { where: { isActive: true } },
        },
      },
    },
    orderBy: { phase: 'asc' },
  });

  res.json({ success: true, data: cities });
}));

// Détail d'une ville
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const city = await prisma.city.findUnique({
    where: { id },
    include: {
      neighborhoods: true,
      _count: {
        select: { pros: { where: { isActive: true } } },
      },
    },
  });

  res.json({ success: true, data: city });
}));

// Pros d'une ville
router.get('/:id/pros', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { page = '1', limit = '20' } = req.query;

  const [pros, total] = await Promise.all([
    prisma.proProfile.findMany({
      where: { cityId: id, isActive: true },
      include: {
        user: { select: { id: true, avatar: true } },
        category: { include: { family: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { proScore: 'desc' },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
    }),
    prisma.proProfile.count({ where: { cityId: id, isActive: true } }),
  ]);

  res.json({
    success: true,
    data: pros,
    pagination: { page: parseInt(page as string), limit: parseInt(limit as string), total },
  });
}));

// Stats d'une ville
router.get('/:id/stats', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [proCount, reviewCount, missionCount, avgScore] = await Promise.all([
    prisma.proProfile.count({ where: { cityId: id, isActive: true } }),
    prisma.review.count({ where: { pro: { cityId: id } } }),
    prisma.mission.count({ where: { pro: { cityId: id } } }),
    prisma.proProfile.aggregate({
      where: { cityId: id, isActive: true },
      _avg: { proScore: true },
    }),
  ]);

  res.json({
    success: true,
    data: { proCount, reviewCount, missionCount, avgProScore: avgScore._avg.proScore },
  });
}));

export default router;
