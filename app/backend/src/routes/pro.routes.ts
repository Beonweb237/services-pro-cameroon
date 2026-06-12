import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { authenticate, optionalAuth } from '../middleware/auth';
import { updateProScoreAndLevel } from '../services/proScore.service';
import type { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Liste paginée avec filtres
router.get('/', optionalAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const {
    page = '1',
    limit = '20',
    cityId,
    categoryId,
    familyId,
    minScore,
    maxPrice,
    level,
    search,
    availability,
    sortBy = 'proScore',
    sortOrder = 'desc',
  } = req.query;

  const pageNum = Math.max(1, parseInt(page as string));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
  const skip = (pageNum - 1) * limitNum;

  const where: any = {
    isActive: true,
  };

  if (cityId) where.cityId = cityId as string;
  if (categoryId) where.categoryId = categoryId as string;
  if (familyId) {
    const cats = await prisma.category.findMany({
      where: { familyId: familyId as string },
      select: { id: true },
    });
    where.categoryId = { in: cats.map(c => c.id) };
  }
  if (minScore) where.proScore = { gte: parseInt(minScore as string) };
  if (level) where.level = level as string;
  if (availability === 'now') where.isAvailableNow = true;
  if (search) {
    where.OR = [
      { title: { contains: search as string, mode: 'insensitive' } },
      { bio: { contains: search as string, mode: 'insensitive' } },
      { primarySkills: { hasSome: [search as string] } },
    ];
  }

  const orderBy: any = {};
  if (sortBy === 'proScore') orderBy.proScore = sortOrder;
  else if (sortBy === 'avgRating') orderBy.avgRating = sortOrder;
  else if (sortBy === 'hourlyRateMin') orderBy.hourlyRateMin = sortOrder;
  else if (sortBy === 'createdAt') orderBy.createdAt = sortOrder;
  else orderBy.proScore = 'desc';

  const [pros, total] = await Promise.all([
    prisma.proProfile.findMany({
      where,
      include: {
        user: {
          select: { id: true, email: true, avatar: true, phone: true },
        },
        category: { include: { family: true } },
        city: true,
        proBadges: { include: { badge: true } },
        _count: { select: { reviews: true, missions: true } },
      },
      orderBy,
      skip,
      take: limitNum,
    }),
    prisma.proProfile.count({ where }),
  ]);

  res.json({
    success: true,
    data: pros,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  });
}));

// Pros du moment (9 profils Elite actifs)
router.get('/featured', asyncHandler(async (_req, res) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const pros = await prisma.proProfile.findMany({
    where: {
      isActive: true,
      level: { in: ['expert', 'elite', 'partner'] },
    },
    include: {
      user: { select: { id: true, avatar: true } },
      category: true,
      city: true,
      _count: { select: { reviews: true } },
    },
    orderBy: [{ proScore: 'desc' }, { totalMissions: 'desc' }],
    take: 9,
  });

  res.json({ success: true, data: pros });
}));

// Leaderboard
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const { categoryId, cityId, period = 'monthly' } = req.query;

  const where: any = { period: period as string };
  if (categoryId) where.categoryId = categoryId as string;
  if (cityId) where.cityId = cityId as string;

  const entries = await prisma.leaderboardEntry.findMany({
    where,
    include: {
      pro: {
        include: {
          user: { select: { id: true, avatar: true } },
          category: true,
          city: true,
        },
      },
      category: true,
    },
    orderBy: { rank: 'asc' },
    take: 10,
  });

  res.json({ success: true, data: entries });
}));

// Détail d'un pro
router.get('/:id', optionalAuth, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const pro = await prisma.proProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, email: true, avatar: true, phone: true, createdAt: true },
      },
      category: { include: { family: true } },
      city: true,
      proBadges: { include: { badge: true } },
      portfolioItems: { orderBy: { order: 'asc' } },
      verificationDocs: { where: { status: 'verified' } },
      subscriptions: {
        where: { status: 'active' },
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { reviews: true, missions: true },
      },
    },
  });

  if (!pro) throw new AppError('Professionnel non trouvé', 404);

  // Récupérer les avis approuvés
  const reviews = await prisma.review.findMany({
    where: { proId: id, moderationStatus: 'approved' },
    include: {
      client: { select: { id: true, email: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  res.json({
    success: true,
    data: { ...pro, reviews },
  });
}));

// Mettre à jour son profil pro (authentifié)
router.put('/:id', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;

  const pro = await prisma.proProfile.findUnique({
    where: { id },
    include: { user: { select: { id: true } } },
  });

  if (!pro) throw new AppError('Professionnel non trouvé', 404);
  if (pro.user.id !== req.user!.id && req.user!.role !== 'admin') {
    throw new AppError('Non autorisé', 403);
  }

  const updateSchema = z.object({
    title: z.string().min(2).optional(),
    bio: z.string().max(600).optional(),
    yearsExperience: z.number().optional(),
    languages: z.array(z.string()).optional(),
    primarySkills: z.array(z.string()).optional(),
    secondarySkills: z.array(z.string()).optional(),
    hourlyRateMin: z.number().optional(),
    hourlyRateMax: z.number().optional(),
    fixedPriceServices: z.any().optional(),
    availability: z.any().optional(),
    isAvailableNow: z.boolean().optional(),
    categoryId: z.string().optional(),
    cityId: z.string().optional(),
    neighborhoods: z.array(z.string()).optional(),
    website: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
  });

  const data = updateSchema.parse(req.body);

  // Recalculer la complétion du profil
  let completion = 40; // base
  if (data.bio && data.bio.length > 100) completion += 20;
  if (data.hourlyRateMin && data.hourlyRateMax) completion += 20;
  if (data.primarySkills && data.primarySkills.length > 0) completion += 20;

  const updated = await prisma.proProfile.update({
    where: { id },
    data: {
      ...data,
      profileCompletion: completion,
      isActive: completion >= 60,
    },
    include: {
      category: true,
      city: true,
      proBadges: { include: { badge: true } },
    },
  });

  res.json({ success: true, data: updated });
}));

export default router;
