import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { prisma } from '../utils/prisma';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload & { id: string; role: string };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Token manquant' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    // Vérifier que l'utilisateur existe toujours
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
      return;
    }

    if (user.status === 'banned') {
      res.status(403).json({ success: false, message: 'Compte banni' });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ success: false, message: 'Compte suspendu' });
      return;
    }

    req.user = { id: user.id, email: user.email, role: user.role, userId: user.id };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentification requise' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Accès non autorisé' });
      return;
    }
    next();
  };
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true },
      });
      if (user) {
        req.user = { id: user.id, email: user.email, role: user.role, userId: user.id };
      }
    }
    next();
  } catch {
    next();
  }
};
