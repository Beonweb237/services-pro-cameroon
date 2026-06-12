# Services Pro Cameroon - Authentification & Securite

## Vue d'ensemble

Systeme d'authentification base sur JWT (JSON Web Tokens) avec double token (Access + Refresh), gestion des roles, protection des routes, et mode demo pour les tests.

---

## 1. Architecture JWT

### 1.1 Double Token System

```
+--------+                                    +--------+
| Client | --(1. Login)--> email + password   | Server |
|        |                                    |        |
|        | <--(2. Tokens)-- access + refresh  |        |
|        |                                    |        |
|        | --(3. API Call)-- access token     |        |
|        |                                    |        |
|        | <--(4. Data)-- reponse JSON       |        |
|        |                                    |        |
|        | --(5. Expire)-- 401 Unauthorized   |        |
|        |                                    |        |
|        | --(6. Refresh)-- refresh token     |        |
|        |                                    |        |
|        | <--(7. New Access)-- nouveau token |        |
+--------+                                    +--------+
```

### 1.2 Access Token

| Attribut | Valeur |
|----------|--------|
| Duree | 15 minutes |
| Contenu | userId, email, role |
| Algorithme | HS256 |
| Secret | JWT_ACCESS_SECRET (env) |
| Stockage | Memoire (Zustand state) |

### 1.3 Refresh Token

| Attribut | Valeur |
|----------|--------|
| Duree | 30 jours |
| Contenu | userId |
| Algorithme | HS256 |
| Secret | JWT_REFRESH_SECRET (env) |
| Stockage | localStorage + Base de donnees |

---

## 2. Implementation JWT (Backend)

### 2.1 Generation des tokens

```typescript
// utils/jwt.ts
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

// Access Token (15 minutes)
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
};

// Refresh Token (30 jours)
export const generateRefreshToken = (payload: { userId: string }): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });
};

// Verification
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, REFRESH_SECRET) as { userId: string };
};
```

### 2.2 Middleware d'authentification

```typescript
// middleware/auth.ts

// Authentification obligatoire
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyAccessToken(token);

  // Verification en BDD
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, email: true, role: true, status: true },
  });

  if (!user) return res.status(401).json({ message: 'Utilisateur non trouve' });
  if (user.status === 'banned') return res.status(403).json({ message: 'Compte banni' });
  if (user.status === 'suspended') return res.status(403).json({ message: 'Compte suspendu' });

  req.user = { id: user.id, email: user.email, role: user.role, userId: user.id };
  next();
};

// Authentification optionnelle
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, email: true, role: true },
      });
      if (user) req.user = { ...decoded, id: user.id };
    }
  } catch { /* ignore */ }
  next();
};

// Verification des roles
export const requireRole = (...roles: string[]) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authentification requise' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Acces non autorise' });
    next();
  };
};
```

---

## 3. Gestion des Mots de Passe

### 3.1 Hashage

```typescript
import bcrypt from 'bcryptjs';

// Hashage (12 rounds = ~250ms)
const hashedPassword = await bcrypt.hash(password, 12);

// Verification
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

### 3.2 Politique de mot de passe

**Validation Zod (inscription) :**
- Minimum 8 caracteres
- Au moins 1 majuscule
- Au moins 1 minuscule
- Au moins 1 chiffre

```typescript
const passwordSchema = z.string()
  .min(8, 'Minimum 8 caracteres')
  .regex(/[A-Z]/, '1 majuscule requise')
  .regex(/[a-z]/, '1 minuscule requise')
  .regex(/[0-9]/, '1 chiffre requis');
```

---

## 4. Mode Demo (Frontend)

### 4.1 Comptes de demo

| Compte | Email | Mot de passe | Role |
|--------|-------|-------------|------|
| Client | client@demo.com | Demo1234 | client |
| Pro | pro@demo.com | Demo1234 | pro |
| Admin | admin@demo.com | Demo1234 | admin |

### 4.2 Implementation

```typescript
// store/authStore.ts - login method

const demoAccounts: Record<string, { password: string; user: User }> = {
  'client@demo.com': {
    password: 'Demo1234',
    user: {
      id: 'demo-client-001',
      email: 'client@demo.com',
      role: 'client',
      phone: '+237 6XX XXX XXX',
      avatar: null,
      status: 'active',
      createdAt: new Date().toISOString(),
      cityId: 'douala',
      clientProfile: {
        id: 'demo-cp-001',
        userId: 'demo-client-001',
        firstName: 'Jean',
        lastName: 'Dupont',
        address: 'Douala, Akwa',
        preferences: {},
      },
    },
  },
  'pro@demo.com': {
    password: 'Demo1234',
    user: {
      id: 'demo-pro-001',
      email: 'pro@demo.com',
      role: 'pro',
      // ... profil pro complet
      proProfile: {
        id: 'demo-pp-001',
        title: 'Plombier Professionnel',
        proScore: 96,
        level: 'elite',
        // ...
      },
    },
  },
  'admin@demo.com': {
    password: 'Demo1234',
    user: {
      id: 'demo-admin-001',
      email: 'admin@demo.com',
      role: 'admin',
      // ...
    },
  },
};

// Logique de connexion
const demo = demoAccounts[email.toLowerCase()];
if (demo && demo.password === password) {
  const mockToken = 'demo-token-' + Date.now();
  set({ user: demo.user, accessToken: mockToken, isAuthenticated: true });
  return true;
}
// Sinon, appel API normal
```

---

## 5. Hierarchie des Roles

### 5.1 Roles disponibles

```
admin        (Controle total)
  |
moderator    (Validation + Moderation)
  |
support      (Support client + Moderation legere)
  |
pro          (Dashboard pro + Profil)
  |
client       (Recherche + Favoris + Avis)
```

### 5.2 Matrice des permissions

| Fonctionnalite | client | pro | support | moderator | admin |
|----------------|--------|-----|---------|-----------|-------|
| Rechercher pros | O | O | O | O | O |
| Contacter pro | O | - | - | - | O |
| Noter pro | O | - | - | - | O |
| Gerer profil | - | O | - | - | O |
| Gerer dispo | - | O | - | - | O |
| Repondre messages | O | O | O | O | O |
| Valider profils | - | - | - | O | O |
| Moderer avis | - | - | - | O | O |
| Gerer utilisateurs | - | - | - | - | O |
| Voir analytics | - | - | - | O | O |
| Config plateforme | - | - | - | - | O |
| Gerer support | - | - | O | O | O |

### 5.3 Protection des routes

```typescript
// Exemples de protection

// Route publique
app.get('/api/pros', optionalAuth, handler);

// Route authentifiee
app.put('/api/pros/:id', authenticate, handler);

// Route admin only
app.get('/api/admin/stats', authenticate, requireRole('admin'), handler);

// Route moderator + admin
app.post('/api/admin/validate/:id', authenticate, requireRole('admin', 'moderator'), handler);
```

---

## 6. Securite des Routes Frontend

### 6.1 Affichage conditionnel (Navigation)

```typescript
const Navigation = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const isPro = user?.role === 'pro';
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <nav>
      {/* Liens publics */}
      <Link to="/trouver">Trouver un Pro</Link>
      
      {/* Liens authentifies */}
      {isAuthenticated && (
        <Link to={isPro ? '/pro/dashboard' : isAdmin ? '/admin/dashboard' : '/client/dashboard'}>
          Dashboard
        </Link>
      )}
      
      {/* Deconnexion */}
      {isAuthenticated && <button onClick={logout}>Deconnexion</button>}
    </nav>
  );
};
```

---

## 7. Mesures de Securite

### 7.1 Protection contre les attaques

| Menace | Contre-mesure | Implementation |
|--------|---------------|----------------|
| Brute force | Rate limiting + Verrouillage | 5 tentatives = verrou 30min |
| XSS | Echappement sorties | React auto-escape |
| CSRF | Tokens + CORS | CORS strict |
| Injection SQL | Prisma ORM | Requetes parametrees |
| Upload malveillant | Validation MIME | Multer + whitelist types |
| JWT vol | Short expiry + Refresh | Access 15min, Refresh 30j |
| Enumeration email | Reponse uniforme | Meme message succes/erreur |

### 7.2 Headers de securite

```typescript
// Middleware Express
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

### 7.3 CORS

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
```

---

## 8. Verification d'identite

### 8.1 Verification telephone (SMS)

```
1. User saisit son numero
2. API genere un code a 6 chiffres
3. SMS envoye via Africa's Talking
4. User saisit le code
5. Compte marque comme phoneVerified
```

### 8.2 Verification identite (Documents)

| Type de document | Obligatoire | Niveau requis |
|------------------|-------------|---------------|
| Piece d'identite | Oui | Certified |
| Diplome | Non | - |
| Licence pro | Selon metier | - |
| Assurance | Recommande | Expert+ |

---

*Document version 1.0 - Authentification & Securite*
