import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'services-pro-super-secret-jwt-key-2026-cameroon';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'services-pro-refresh-secret-key-2026-cameroon';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: { userId: string }): string => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
};
