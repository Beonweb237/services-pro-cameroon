import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Familles de services
router.get('/families', asyncHandler(async (_req, res) => {
  const families = await prisma.serviceFamily.findMany({
    include: {
      _count: { select: { categories: true } },
      categories: {
        select: { id: true, name: true, slug: true, prosCount: true },
      },
    },
    orderBy: { order: 'asc' },
  });

  res.json({ success: true, data: families });
}));

// Toutes les catégories
router.get('/categories', asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: {
      family: true,
      _count: { select: { pros: { where: { isActive: true } } } },
    },
    orderBy: { order: 'asc' },
  });

  res.json({ success: true, data: categories });
}));

// Détail catégorie
router.get('/categories/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      family: true,
      pros: {
        where: { isActive: true },
        include: {
          user: { select: { id: true, avatar: true } },
          city: true,
          _count: { select: { reviews: true } },
        },
        orderBy: { proScore: 'desc' },
        take: 10,
      },
    },
  });

  res.json({ success: true, data: category });
}));

export default router;
