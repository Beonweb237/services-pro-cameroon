import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import type { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Schémas de validation
const registerClientSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères').regex(/[A-Z]/, '1 majuscule requise').regex(/[a-z]/, '1 minuscule requise').regex(/[0-9]/, '1 chiffre requis'),
  phone: z.string().min(9, 'Téléphone invalide'),
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  cityId: z.string().optional(),
});

const registerProSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères').regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  phone: z.string().min(9, 'Téléphone invalide'),
  fullName: z.string().min(2, 'Nom complet requis'),
  categoryId: z.string().min(1, 'Catégorie requise'),
  cityId: z.string().min(1, 'Ville requise'),
  title: z.string().min(2, 'Titre métier requis'),
  bio: z.string().max(600, 'Bio max 600 caractères').optional(),
  hourlyRateMin: z.number().optional(),
  hourlyRateMax: z.number().optional(),
  languages: z.array(z.string()).default(['français']),
  primarySkills: z.array(z.string()).default([]),
  yearsExperience: z.number().default(0),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Inscription Client (2 étapes - ici étape 1 complète)
router.post('/register/client', asyncHandler(async (req, res) => {
  const data = registerClientSchema.parse(req.body);

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });
  if (existing) throw new AppError('Cet email est déjà utilisé', 409);

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: 'client',
      cityId: data.cityId,
      clientProfile: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
    },
    select: {
      id: true,
      email: true,
      role: true,
      phone: true,
      clientProfile: true,
    },
  });

  const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  });

  res.status(201).json({
    success: true,
    data: { user, accessToken, refreshToken },
  });
}));

// Inscription Professionnel (4 étapes - ici étape 1 complète)
router.post('/register/pro', asyncHandler(async (req, res) => {
  const data = registerProSchema.parse(req.body);

  const existing = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });
  if (existing) throw new AppError('Cet email est déjà utilisé', 409);

  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Calculer la complétion du profil
  let completion = 40; // email, password, phone, name
  if (data.bio && data.bio.length > 100) completion += 20;
  if (data.hourlyRateMin && data.hourlyRateMax) completion += 20;
  if (data.primarySkills.length > 0) completion += 20;

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      role: 'pro',
      cityId: data.cityId,
      proProfile: {
        create: {
          title: data.title,
          bio: data.bio,
          categoryId: data.categoryId,
          cityId: data.cityId,
          hourlyRateMin: data.hourlyRateMin,
          hourlyRateMax: data.hourlyRateMax,
          languages: data.languages,
          primarySkills: data.primarySkills,
          yearsExperience: data.yearsExperience,
          profileCompletion: completion,
          level: completion >= 60 ? 'starter' : 'starter',
          isActive: completion >= 60,
        },
      },
    },
    select: {
      id: true,
      email: true,
      role: true,
      phone: true,
      proProfile: true,
    },
  });

  const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  });

  res.status(201).json({
    success: true,
    data: { user, accessToken, refreshToken },
  });
}));

// Connexion
router.post('/login', asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email: data.email },
    include: {
      proProfile: true,
      clientProfile: true,
    },
  });

  if (!user) throw new AppError('Email ou mot de passe incorrect', 401);

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) throw new AppError('Email ou mot de passe incorrect', 401);

  // Vérifier si le compte est verrouillé
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AppError(`Compte temporairement verrouillé. Réessayez après ${user.lockedUntil.toISOString()}`, 423);
  }

  // Réinitialiser les tentatives
  await prisma.user.update({
    where: { id: user.id },
    data: { loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
  });

  const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
  const refreshToken = generateRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: { userId: user.id, token: refreshToken, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  });

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        proProfile: user.proProfile,
        clientProfile: user.clientProfile,
      },
      accessToken,
      refreshToken,
    },
  });
}));

// Refresh token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token manquant', 401);

  const decoded = verifyRefreshToken(refreshToken);

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Refresh token invalide ou expiré', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) throw new AppError('Utilisateur non trouvé', 401);

  const newAccessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  res.json({
    success: true,
    data: { accessToken: newAccessToken },
  });
}));

// Vérification téléphone (simulé)
router.post('/verify-phone', asyncHandler(async (req, res) => {
  const { phone, code } = req.body;
  
  // TODO: Intégrer Africa's Talking pour SMS réels
  // Pour l'instant, accepter le code "123456"
  if (code === '123456') {
    res.json({ success: true, message: 'Téléphone vérifié' });
  } else {
    throw new AppError('Code incorrect', 400);
  }
}));

// Mot de passe oublié
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Ne pas révéler si l'email existe
    res.json({ success: true, message: 'Si cet email existe, un lien a été envoyé' });
    return;
  }

  const token = generateRefreshToken({ userId: user.id });
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 heures
    },
  });

  // TODO: Envoyer email avec Nodemailer
  res.json({ success: true, message: 'Si cet email existe, un lien a été envoyé' });
}));

// Reset password
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const reset = await prisma.passwordReset.findFirst({
    where: { token, usedAt: null, expiresAt: { gt: new Date() } },
  });

  if (!reset) throw new AppError('Token invalide ou expiré', 400);

  const hashed = await bcrypt.hash(newPassword, 12);
  
  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: { password: hashed },
    }),
    prisma.passwordReset.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    }),
  ]);

  res.json({ success: true, message: 'Mot de passe mis à jour' });
}));

// Logout
router.delete('/logout', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    await prisma.refreshToken.deleteMany({
      where: { userId: req.user!.id },
    });
  }
  res.json({ success: true, message: 'Déconnecté' });
}));

// Me
router.get('/me', authenticate, asyncHandler(async (req: AuthenticatedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: {
      proProfile: {
        include: {
          category: true,
          city: true,
          proBadges: { include: { badge: true } },
          subscriptions: {
            where: { status: 'active' },
            include: { plan: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
      clientProfile: true,
      city: true,
    },
  });

  res.json({ success: true, data: user });
}));

export default router;
