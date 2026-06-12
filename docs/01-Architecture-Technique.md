# Services Pro Cameroon - Architecture Technique

## Vue d'ensemble

Services Pro Cameroon est une plateforme fullstack de mise en relation entre professionnels et clients au Cameroun. L'architecture suit un pattern moderne en couches avec separation claire entre frontend, backend et base de donnees.

---

## 1. Stack Technologique

### 1.1 Frontend

| Technologie | Version | Role |
|-------------|---------|------|
| React | 18.x | Bibliotheque UI principale |
| TypeScript | 5.x | Typage statique |
| Vite | 5.x | Bundler et dev server |
| Tailwind CSS | 3.4.x | Framework CSS utilitaire |
| shadcn/ui | latest | Composants UI reutilisables |
| React Router DOM | 6.x | Routage cote client |
| Zustand | 4.x | State management |
| React Query (TanStack) | 5.x | Gestion des requetes API |
| Lucide React | latest | Icones SVG |
| GSAP | 3.x | Animations avancees |
| Lenis | latest | Smooth scrolling |

### 1.2 Backend

| Technologie | Version | Role |
|-------------|---------|------|
| Node.js | 20.x | Runtime JavaScript |
| Express | 4.x | Framework web |
| TypeScript | 5.x | Typage statique |
| Prisma ORM | 5.x | ORM et migrations |
| PostgreSQL | 15+ | Base de donnees relationnelle |
| bcryptjs | 2.x | Hashage des mots de passe |
| jsonwebtoken (JWT) | 9.x | Authentification par token |
| Zod | 3.x | Validation des schemas |
| Multer | 1.x | Upload de fichiers |
| Cloudinary SDK | 2.x | Stockage cloud d'images |
| Nodemailer | 6.x | Envoi d'emails |
| Africa's Talking SDK | latest | Envoi de SMS |
| Socket.io | 4.x | Communication temps reel |
| Redis | 7.x | Cache et sessions |

### 1.3 DevOps & Outils

| Outil | Usage |
|-------|-------|
| ESLint | Linting du code |
| Prettier | Formatage du code |
| Husky | Git hooks |
| GitHub Actions | CI/CD |
| Docker | Containerisation |
| Render / Railway | Deploiement backend |
| Vercel / Netlify | Deploiement frontend |

---

## 2. Structure du Projet

```
services-pro-cameroon/
|
|-- frontend/                          # Application React
|   |-- src/
|   |   |-- App.tsx                    # Point d'entree et routes
|   |   |-- main.tsx                   # Montage React + providers
|   |   |-- index.css                  # Variables CSS theme + animations
|   |   |
|   |   |-- pages/                     # Pages route-level
|   |   |   |-- Home.tsx               # Page d'accueil
|   |   |   |-- Login.tsx              # Connexion
|   |   |   |-- Register.tsx           # Inscription
|   |   |   |-- Search.tsx             # Resultats de recherche
|   |   |   |-- ProDetail.tsx          # Profil d'un pro
|   |   |   |-- FamiliesPage.tsx       # Familles de services
|   |   |   |-- VillesPage.tsx         # Villes couvertes
|   |   |   |-- LeaderboardPage.tsx    # Classement
|   |   |   |-- CommentCaMarchePage.tsx # Comment ca marche
|   |   |   |-- TarifsPage.tsx         # Plans tarifaires
|   |   |   |-- FAQPage.tsx            # FAQ
|   |   |   |
|   |   |   |-- dashboard/             # Pages dashboard
|   |   |       |-- ClientDashboard.tsx
|   |   |       |-- ProDashboard.tsx
|   |   |       |-- AdminDashboard.tsx
|   |   |       |-- ProAvailability.tsx
|   |   |       |-- PlaceholderPage.tsx
|   |   |
|   |   |-- sections/                  # Sections landing page
|   |   |   |-- Hero.tsx               # Hero avec carrousel 3D
|   |   |   |-- Stats.tsx              # Statistiques
|   |   |   |-- Categories.tsx         # Categories de services
|   |   |   |-- Cities.tsx             # Villes
|   |   |   |-- Families.tsx           # Familles de metiers
|   |   |   |-- HowItWorks.tsx         # Comment ca marche
|   |   |   |-- ProScore.tsx           # Explication ProScore
|   |   |   |-- Pricing.tsx            # Plans tarifaires
|   |   |   |-- Leaderboard.tsx        # Classement
|   |   |   |-- Testimonials.tsx       # Temoignages
|   |   |   |-- TrustBanner.tsx        # Banniere confiance
|   |   |   |-- FAQ.tsx                # FAQ section
|   |   |   |-- CTA.tsx                # Call to action
|   |   |   |-- Footer.tsx             # Pied de page
|   |   |   |-- Navigation.tsx         # Barre de navigation
|   |   |   |-- ProsMoment.tsx         # Pros du moment
|   |   |   |-- ProfileShowcase.tsx    # Vitrine profils
|   |   |   |-- Roadmap.tsx            # Feuille de route
|   |   |
|   |   |-- layouts/                   # Layouts dashboard
|   |   |   |-- ClientLayout.tsx       # Layout espace client
|   |   |   |-- ProLayout.tsx          # Layout espace pro
|   |   |   |-- AdminLayout.tsx        # Layout espace admin
|   |   |
|   |   |-- components/                # Composants partages
|   |   |   |-- ThemeProvider.tsx      # Provider theme clair/sombre
|   |   |   |-- ThemeToggle.tsx        # Bouton toggle theme
|   |   |   |-- ui/                    # shadcn/ui components
|   |   |
|   |   |-- store/                     # State management Zustand
|   |   |   |-- authStore.ts           # Auth state + login demo
|   |   |   |-- themeStore.ts          # Theme state (dark/light/system)
|   |   |   |-- uiStore.ts             # UI state (menu, toast)
|   |   |
|   |   |-- types/                     # Types TypeScript
|   |   |   |-- index.ts               # Tous les types/interfaces
|   |   |
|   |   |-- hooks/                     # Custom hooks React
|   |   |-- lib/                       # Utilitaires
|   |   |   |-- api.ts                 # Client HTTP (axios)
|   |   |   |-- utils.ts               # Fonctions utilitaires
|   |   |
|   |   |-- sections/                  # (deja liste ci-dessus)
|   |
|   |-- public/                        # Assets statiques
|   |-- index.html                     # HTML d'entree
|   |-- vite.config.ts                 # Configuration Vite
|   |-- tailwind.config.js             # Configuration Tailwind
|   |-- tsconfig.json                  # Configuration TypeScript
|   |-- package.json
|
|-- backend/                           # API Express
|   |-- src/
|   |   |-- index.ts                   # Point d'entree Express
|   |   |
|   |   |-- routes/                    # Routeurs API
|   |   |   |-- auth.routes.ts         # Auth (login, register, refresh)
|   |   |   |-- pro.routes.ts          # Professionnels (CRUD, recherche)
|   |   |   |-- review.routes.ts       # Avis et notations
|   |   |   |-- city.routes.ts         # Villes et quartiers
|   |   |   |-- category.routes.ts     # Categories et familles
|   |   |   |-- message.routes.ts      # Messagerie
|   |   |   |-- admin.routes.ts        # Administration
|   |   |
|   |   |-- middleware/                # Middleware Express
|   |   |   |-- auth.ts                # Auth JWT + roles
|   |   |   |-- errorHandler.ts        # Gestion des erreurs
|   |   |
|   |   |-- services/                  # Services metier
|   |   |   |-- proScore.service.ts    # Calcul ProScore + niveaux
|   |   |
|   |   |-- utils/                     # Utilitaires
|   |       |-- prisma.ts              # Client Prisma
|   |       |-- jwt.ts                 # Fonctions JWT
|   |       |-- cloudinary.ts          # Upload Cloudinary
|   |       |-- email.ts               # Envoi d'emails
|   |       |-- sms.ts                 # Envoi de SMS
|   |       |-- socket.ts              # Socket.io
|   |
|   |-- prisma/
|   |   |-- schema.prisma              # Schema complet Prisma
|   |   |-- seed.ts                    # Donnees initiales
|   |
|   |-- uploads/                       # Fichiers uploads temporaires
|   |-- .env                           # Variables d'environnement
|   |-- tsconfig.json
|   |-- package.json
|
|-- docker-compose.yml                 # Services Docker
|-- README.md
|-- .gitignore
```

---

## 3. Architecture Logicielle

### 3.1 Pattern Frontend

**Pattern : Composition de composants avec separation Container/Presentation**

```
Page (Route) -> Layout -> Sections/Components -> UI Elements
     |              |           |                   |
  State         Sidebar    Business Logic      shadcn/ui
  Fetching      + Topbar   + Data Display     + Tailwind
```

**Flux de donnees :**
1. Les pages contiennent le routing et le data fetching (React Query)
2. Les layouts fournissent la structure (sidebar, topbar, content area)
3. Les sections encapsulent la logique metier et l'affichage
4. Les composants UI sont purs et reutilisables

### 3.2 Pattern Backend

**Pattern : Layered Architecture (Controller -> Service -> Repository)**

```
HTTP Request -> Route -> Middleware -> Controller -> Service -> Prisma -> PostgreSQL
                                         |              |
                                    Validation Zod   Business Logic
                                    Auth/Roles       Calculs
```

### 3.3 Communication Frontend-Backend

```
Frontend (React)          Backend (Express)
     |                           |
axios/api.ts  --------->  Routes API
     |                           |
React Query <-----------  JSON Response
     |
Zustand Store
```

**Format des reponses API :**
```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

---

## 4. Flux d'Authentification

### 4.1 Inscription Client (2 etapes)

```
Etape 1: Saisie email, password, phone, nom, prenom, ville
  |
  v
Validation Zod (email unique, password securise)
  |
  v
Creation User + ClientProfile (Prisma transaction)
  |
  v
Generation JWT Access (15min) + Refresh (30j)
  |
  v
Stockage RefreshToken en BDD + redirection Dashboard
```

### 4.2 Inscription Pro (4 etapes)

```
Etape 1: Compte (email, password, phone)
Etape 2: Identite (nom, ville, categorie, titre)
Etape 3: Competences (skills, experience, bio, tarifs)
Etape 4: Verification (SMS, documents)
  |
  v
Calcul completion profil (base 40% + bio 20% + tarifs 20% + skills 20%)
  |
  v
Activation si completion >= 60%
```

### 4.3 Connexion

```
Saisie email + password
  |
  v
Mode Demo? (client@demo.com / pro@demo.com / admin@demo.com)
  |-- OUI -> Authentification locale (sans API)
  |
  v
NON -> Verification BDD (bcrypt.compare)
  |
  v
Generation tokens + mise a jour lastLoginAt
  |
  v
Redirection vers dashboard selon le role
```

---

## 5. Gestion du Theme (Clair/Sombre)

### 5.1 Systeme de Variables CSS

Le theme utilise des variables CSS avec l'attribut `data-theme` sur l'element `<html>`.

**Dark theme (par defaut) :**
```css
:root {
  --bg-primary: #0A0A0F;
  --bg-secondary: #14141E;
  --bg-elevated: #1A1A28;
  --bg-hover: #22222F;
  --bg-input: #0F0F18;
  --text-primary: #F0F0F5;
  --text-secondary: #A0A0B8;
  --text-tertiary: #6B6B80;
  --text-muted: #4A4A58;
  --gold: #D4A853;
  --gold-light: #E8C87A;
  --border-color: rgba(255,255,255,0.06);
  --shadow-card: 0 4px 20px rgba(0,0,0,0.3);
}
```

**Light theme :**
```css
[data-theme="light"] {
  --bg-primary: #F8F9FC;
  --bg-secondary: #FFFFFF;
  --bg-elevated: #FFFFFF;
  --bg-hover: #F0F1F5;
  --bg-input: #F0F1F5;
  --text-primary: #1A1A2E;
  --text-secondary: #4A4A5E;
  --text-tertiary: #7A7A8E;
  --gold: #B8932F;
  --border-color: rgba(0,0,0,0.08);
  --shadow-card: 0 2px 12px rgba(0,0,0,0.08);
}
```

### 5.2 Classes Utilitaires Theme

```css
.page-bg      { background-color: var(--bg-primary); }
.card-bg      { background-color: var(--bg-elevated); }
.card-border  { border: 1px solid var(--border-color); }
.input-bg     { background-color: var(--bg-input); }
.text-pri     { color: var(--text-primary); }
.text-sec     { color: var(--text-secondary); }
.text-ter     { color: var(--text-tertiary); }
.text-muted   { color: var(--text-muted); }
```

---

## 6. Routes de l'Application

### 6.1 Routes Publiques

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Page d'accueil avec hero, stats, categories |
| `/login` | Login | Connexion avec comptes demo |
| `/inscription/client` | Register | Inscription client |
| `/inscription/pro` | Register | Inscription pro |
| `/trouver` | Search | Recherche avec filtres |
| `/trouver/:categorie` | Search | Recherche par categorie |
| `/trouver/:categorie/:ville` | Search | Recherche par categorie + ville |
| `/pro/:slug` | ProDetail | Profil detail d'un pro |
| `/familles` | FamiliesPage | 10 familles de services |
| `/villes` | VillesPage | 14 villes couvertes |
| `/leaderboard` | LeaderboardPage | Classement pros |
| `/comment-ca-marche` | CommentCaMarchePage | Processus 6 etapes |
| `/tarifs` | TarifsPage | 4 plans tarifaires |
| `/faq` | FAQPage | FAQ par categorie |

### 6.2 Routes Client (`/client/*`)

| Route | Page | Description |
|-------|------|-------------|
| `/client/dashboard` | ClientDashboard | Tableau de bord |
| `/client/messages` | Placeholder | Messagerie |
| `/client/missions` | Placeholder | Missions |
| `/client/favoris` | Placeholder | Favoris |
| `/client/avis` | Placeholder | Avis |
| `/client/parametres` | Placeholder | Parametres |

### 6.3 Routes Pro (`/pro/*`)

| Route | Page | Description |
|-------|------|-------------|
| `/pro/dashboard` | ProDashboard | Tableau de bord pro |
| `/pro/messages` | Placeholder | Messages clients |
| `/pro/profil` | Placeholder | Edition profil |
| `/pro/disponibilites` | ProAvailability | Gestion disponibilites |
| `/pro/missions` | Placeholder | Missions |
| `/pro/avis` | Placeholder | Avis recus |
| `/pro/statistiques` | Placeholder | Analytics |
| `/pro/documents` | Placeholder | Documents |
| `/pro/boost` | Placeholder | Visibilite |
| `/pro/parametres` | Placeholder | Parametres |

### 6.4 Routes Admin (`/admin/*`)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/dashboard` | AdminDashboard | Vue d'ensemble |
| `/admin/validation` | Placeholder | Validation profils |
| `/admin/moderation` | Placeholder | Moderation |
| `/admin/utilisateurs` | Placeholder | Gestion utilisateurs |
| `/admin/analytics` | Placeholder | Statistiques |
| `/admin/support` | Placeholder | Tickets support |
| `/admin/config` | Placeholder | Configuration |

---

## 7. Environnements

### 7.1 Developpement

```env
# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=ws://localhost:5000

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/servicespro
JWT_ACCESS_SECRET=dev_access_secret
JWT_REFRESH_SECRET=dev_refresh_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
SMTP_HOST=smtp.gmail.com
SMTP_USER=xxx
SMTP_PASS=xxx
AFRICASTALKING_API_KEY=xxx
AFRICASTALKING_USERNAME=xxx
REDIS_URL=redis://localhost:6379
```

### 7.2 Production

```env
DATABASE_URL=postgresql://... (Render/Railway)
JWT_ACCESS_SECRET=<strong_random>
JWT_REFRESH_SECRET=<strong_random>
FRONTEND_URL=https://servicespro.cm
NODE_ENV=production
```

---

## 8. Considerations de Performance

### 8.1 Optimisations Frontend
- **Code splitting** : Chargement paresseux des pages dashboard
- **React Query caching** : Donnees mises en cache 5 minutes
- **Memoization** : React.memo sur les composants couteux
- **Virtualisation** : Listes longues (pros, messages)
- **Images** : Format WebP, lazy loading, tailles responsives
- **Animations** : GPU-accelerated (transform, opacity)

### 8.2 Optimisations Backend
- **Indexes Prisma** : Indexes sur proScore, level, categoryId, cityId
- **Pagination** : Toutes les listes paginees (max 50 items/page)
- **Caching Redis** : Sessions, tokens, donnees frequemment accedees
- **Connection Pooling** : Pool Prisma par defaut

---

## 9. Securite

### 9.1 Mesures Implementees
- **Hashage mots de passe** : bcrypt avec 12 rounds
- **JWT securise** : Access token 15min, Refresh token 30j
- **Rate limiting** : Protection contre brute force
- **Validation Zod** : Toutes les entrees validees
- **CORS** : Origines autorisees uniquement
- **XSS Protection** : Echappement des sorties
- **CSRF Tokens** : Protection des formulaires
- **Upload securise** : Verification type MIME, taille max

### 9.2 Roles et Permissions

| Role | Permissions |
|------|-------------|
| `client` | Rechercher, contacter, noter, favoris |
| `pro` | Dashboard, profil, disponibilites, missions |
| `support` | Tickets support, moderation legere |
| `moderator` | Validation profils, moderation complete |
| `admin` | Controle total, analytics, configuration |

---

*Document version 1.0 - Services Pro Cameroon*
