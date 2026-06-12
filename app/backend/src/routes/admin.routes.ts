import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { authenticate, requireRole } from '../middleware/auth';
import type { AuthenticatedRequest } from '../middleware/auth';
import { updateProScoreAndLevel } from '../services/proScore.service';

const router = Router();

// Toutes les routes admin nécessitent le rôle admin
router.use(authenticate, requireRole('admin', 'moderator'));

// Stats dashboard
router.get('/stats', asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    totalPros,
    totalClients,
    totalReviews,
    totalMissions,
    pendingProfiles,
    pendingReviews,
    pendingReports,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'pro' } }),
    prisma.user.count({ where: { role: 'client' } }),
    prisma.review.count(),
    prisma.mission.count(),
    prisma.proProfile.count({ where: { isVerified: false } }),
    prisma.review.count({ where: { moderationStatus: 'pending' } }),
    prisma.report.count({ where: { status: 'pending' } }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, email: true, role: true, createdAt: true },
    }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsers,
      totalPros,
      totalClients,
      totalReviews,
      totalMissions,
      pendingProfiles,
      pendingReviews,
      pendingReports,
      recentUsers,
    },
  });
}));

// Utilisateurs
router.get('/users', asyncHandler(async (req, res) => {
  const { page = '1', limit = '20', search, role } = req.query;

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { email: { contains: search as string, mode: 'insensitive' } },
      { phone: { contains: search as string } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        proProfile: { select: { id: true, title: true, level: true, isActive: true } },
        clientProfile: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
    }),
    prisma.user.count({ where }),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: { page: parseInt(page as string), limit: parseInt(limit as string), total },
  });
}));

// Modifier un utilisateur
router.put('/users/:id', requireRole('admin'), asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const schema = z.object({
    role: z.enum(['client', 'pro', 'moderator', 'admin']).optional(),
    status: z.enum(['active', 'suspended', 'banned', 'pending']).optional(),
  });

  const data = schema.parse(req.body);

  const updated = await prisma.user.update({
    where: { id },
    data,
    include: {
      proProfile: true,
      clientProfile: true,
    },
  });

  res.json({ success: true, data: updated });
}));

// Profils en attente de validation
router.get('/pending-profiles', asyncHandler(async (_req, res) => {
  const profiles = await prisma.proProfile.findMany({
    where: { isVerified: false },
    include: {
      user: { select: { id: true, email: true, phone: true, createdAt: true } },
      category: true,
      city: true,
      verificationDocs: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  res.json({ success: true, data: profiles });
}));

// Valider un profil
router.put('/profiles/:id/validate', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const id = req.params.id as string;
  const { status } = z.object({ status: z.enum(['verified', 'rejected']) }).parse(req.body);

  const pro = await prisma.proProfile.update({
    where: { id },
    data: {
      isVerified: status === 'verified',
      isIdentityVerified: status === 'verified',
    },
    include: {
      user: { select: { id: true, email: true } },
    },
  });

  if (status === 'verified') {
    // Mettre à jour le niveau si conditions remplies
    await updateProScoreAndLevel(id);

    await prisma.notification.create({
      data: {
        userId: pro.userId,
        type: 'badge_unlocked',
        title: 'Profil vérifié',
        content: 'Votre profil a été vérifié avec succès !',
      },
    });
  }

  res.json({ success: true, data: pro });
}));

// Avis en attente de modération
router.get('/pending-reviews', asyncHandler(async (_req, res) => {
  const reviews = await prisma.review.findMany({
    where: { moderationStatus: 'pending' },
    include: {
      pro: { include: { user: { select: { email: true } } } },
      client: { select: { email: true, avatar: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  res.json({ success: true, data: reviews });
}));

// Modérer un avis
router.put('/reviews/:id/moderate', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status } = z.object({ status: z.enum(['approved', 'rejected']) }).parse(req.body);

  const review = await prisma.review.update({
    where: { id },
    data: { moderationStatus: status, isModerated: true },
  });

  // Recalculer le Pro Score
  await updateProScoreAndLevel(review.proId);

  res.json({ success: true, data: review });
}));

// Signalements
router.get('/reports', asyncHandler(async (req, res) => {
  const { status, priority } = req.query;

  const where: any = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;

  const reports = await prisma.report.findMany({
    where,
    include: {
      reporter: { select: { email: true } },
    },
    orderBy: [
      { priority: 'asc' },
      { createdAt: 'desc' },
    ],
  });

  res.json({ success: true, data: reports });
}));

// Résoudre un signalement
router.put('/reports/:id/resolve', asyncHandler(async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status, resolution } = z.object({
    status: z.enum(['resolved', 'dismissed']),
    resolution: z.string().optional(),
  }).parse(req.body);

  const report = await prisma.report.update({
    where: { id },
    data: {
      status,
      resolution,
      resolvedAt: new Date(),
      resolvedBy: req.user!.id,
    },
  });

  res.json({ success: true, data: report });
}));

// CRUD Villes (admin)
router.post('/cities', requireRole('admin'), asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    region: z.string().min(1),
    population: z.number().optional(),
    image: z.string().optional(),
    phase: z.number().default(1),
  });

  const data = schema.parse(req.body);
  const city = await prisma.city.create({ data });
  res.status(201).json({ success: true, data: city });
}));

// CRUD Catégories (admin)
router.post('/categories', requireRole('admin'), asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    familyId: z.string(),
    image: z.string().optional(),
    order: z.number().default(0),
  });

  const data = schema.parse(req.body);
  const category = await prisma.category.create({ data });
  res.status(201).json({ success: true, data: category });
}));

// CRUD FAQ (admin)
router.post('/faqs', requireRole('admin'), asyncHandler(async (req, res) => {
  const schema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
    category: z.string().default('general'),
    order: z.number().default(0),
  });

  const data = schema.parse(req.body);
  const faq = await prisma.fAQ.create({ data });
  res.status(201).json({ success: true, data: faq });
}));

// CRUD Blog Posts (admin)
router.post('/blog-posts', requireRole('admin'), asyncHandler(async (req, res) => {
  const schema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    excerpt: z.string().optional(),
    content: z.string().min(1),
    coverImage: z.string().optional(),
    authorName: z.string().min(1),
    category: z.string().default('guide_client'),
    tags: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
  });

  const data = schema.parse(req.body);
  const post = await prisma.blogPost.create({
    data: { ...data, authorId: req.user!.id },
  });
  res.status(201).json({ success: true, data: post });
}));

export default router;
