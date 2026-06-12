# Services Pro Cameroon - Architecture Frontend

## Vue d'ensemble

Frontend React 18 + TypeScript avec Vite comme bundler. Architecture modulaire basee sur des sections composables, un systeme de theming CSS variables, et une gestion d'etat distribuee via Zustand.

---

## 1. Structure des Composants

### 1.1 Hierarchie de composants

```
App.tsx (Router + QueryClientProvider)
  |
  +-- Home.tsx (Page accueil)
  |     +-- Navigation.tsx
  |     +-- Hero.tsx (Carrousel 3D + Recherche)
  |     +-- Stats.tsx
  |     +-- Categories.tsx
  |     +-- Cities.tsx
  |     +-- HowItWorks.tsx
  |     +-- Families.tsx
  |     +-- ProScore.tsx
  |     +-- ProsMoment.tsx
  |     +-- Pricing.tsx
  |     +-- Leaderboard.tsx
  |     +-- Testimonials.tsx
  |     +-- TrustBanner.tsx
  |     +-- FAQ.tsx
  |     +-- CTA.tsx
  |     +-- Roadmap.tsx
  |     +-- Footer.tsx
  |
  +-- Login.tsx
  +-- Register.tsx
  +-- Search.tsx
  +-- ProDetail.tsx
  +-- VillesPage.tsx
  +-- FamiliesPage.tsx
  +-- LeaderboardPage.tsx
  +-- TarifsPage.tsx
  +-- FAQPage.tsx
  +-- CommentCaMarchePage.tsx
  |
  +-- ClientLayout.tsx
  |     +-- ClientDashboard.tsx
  |     +-- PlaceholderPage (x5)
  |
  +-- ProLayout.tsx
  |     +-- ProDashboard.tsx
  |     +-- ProAvailability.tsx
  |     +-- PlaceholderPage (x8)
  |
  +-- AdminLayout.tsx
        +-- AdminDashboard.tsx
        +-- PlaceholderPage (x6)
```

---

## 2. Systeme de Theme

### 2.1 Architecture Theme

Le theme utilise **CSS Custom Properties** avec l'attribut `data-theme` sur `<html>`. Aucun contexte React n'est necessaire, le changement est instantane.

```
ThemeProvider.tsx
  |
  +-- Lit le store Zustand (theme: 'dark' | 'light' | 'system')
  +-- Applique data-theme="dark|light" sur <html>
  +-- Enregistre dans localStorage
  |
ThemeToggle.tsx
  |
  +-- Bouton avec icones Sun/Moon
  +-- Toggle entre dark/light
```

### 2.2 Store Theme (Zustand)

```typescript
// store/themeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: Theme;
  resolved: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      resolved: 'dark',

      setTheme: (theme) => {
        const resolved = theme === 'system'
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme;
        document.documentElement.setAttribute('data-theme', resolved);
        set({ theme, resolved });
      },

      toggle: () => {
        const newTheme = get().resolved === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        set({ theme: newTheme, resolved: newTheme });
      },
    }),
    { name: 'theme-preference' }
  )
);
```

### 2.3 Variables CSS

**Dark theme (defaut) :**
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
  --gold-dim: rgba(212,168,83,0.15);
  --border-color: rgba(255,255,255,0.06);
  --border-hover: rgba(212,168,83,0.25);
  --shadow-card: 0 4px 20px rgba(0,0,0,0.3);
  --shadow-hover: 0 10px 40px rgba(212,168,83,0.06);
  --success: #2ECC71;
  --warning: #F5A623;
  --danger: #E74C3C;
  --info: #3B82F6;
  --elite: #A78BFA;
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
  --text-muted: #AAAAB8;
  --gold: #B8932F;
  --gold-light: #D4A853;
  --gold-dim: rgba(184,147,47,0.10);
  --border-color: rgba(0,0,0,0.08);
  --border-hover: rgba(184,147,47,0.40);
  --shadow-card: 0 2px 12px rgba(0,0,0,0.08);
  --shadow-hover: 0 8px 30px rgba(0,0,0,0.12);
  --success: #27AE60;
  --warning: #E67E22;
  --danger: #E74C3C;
  --info: #3498DB;
  --elite: #8E7CC3;
}
```

### 2.4 Classes utilitaires theme

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

## 3. State Management (Zustand)

### 3.1 Auth Store

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<boolean>;
  registerClient: (data: RegisterClientData) => Promise<boolean>;
  registerPro: (data: RegisterProData) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshToken: () => Promise<boolean>;
}
```

**Persistance :** user, accessToken, isAuthenticated dans localStorage

### 3.2 UI Store

```typescript
interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}
```

### 3.3 Theme Store

(Voir section 2.2)

---

## 4. Systeme de Routing

### 4.1 React Router v6

```typescript
// App.tsx
import { Routes, Route } from 'react-router-dom';

<Routes>
  {/* Public */}
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/trouver" element={<SearchPage />} />
  <Route path="/pro/:slug" element={<ProDetail />} />
  
  {/* Client */}
  <Route path="/client" element={<ClientLayout />}>
    <Route path="dashboard" element={<ClientDashboard />} />
    <Route path="messages" element={<PlaceholderPage />} />
  </Route>
  
  {/* Pro */}
  <Route path="/pro" element={<ProLayout />}>
    <Route path="dashboard" element={<ProDashboard />} />
    <Route path="disponibilites" element={<ProAvailability />} />
  </Route>
  
  {/* Admin */}
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
  </Route>
</Routes>
```

### 4.2 HashRouter (deploiement statique)

Pour le deploiement sur CDN statique, le HashRouter est utilise a la place du BrowserRouter.

---

## 5. Data Fetching (React Query)

### 5.1 Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,     // 5 minutes
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### 5.2 Client HTTP (Axios)

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur pour le token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && !token.startsWith('demo-token')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour le refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await useAuthStore.getState().refreshToken();
      if (refreshed) {
        return api.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 6. Layouts Dashboard

### 6.1 ClientLayout

```
+------------------+
| Topbar (logo)    |
+------------------+
| Sidebar |        |
| - Tableau        |
| - Messages       |
| - Missions       |
| - Favoris        |
| - Avis           |
| - Parametres     |
|                  |
| [Deconnexion]    |
+------------------+
         | Content (Outlet)
         |
+------------------+
| Mobile Bottom Nav|
+------------------+
```

**Navigation (6 items) :**
1. Tableau de bord (LayoutDashboard)
2. Messages (MessageSquare)
3. Missions (ClipboardList)
4. Favoris (Heart)
5. Mes avis (Star)
6. Parametres (Settings)

### 6.2 ProLayout

**Navigation (10 items) :**
1. Dashboard (LayoutDashboard)
2. Messages (MessageSquare)
3. Mon profil (User)
4. Disponibilites (CalendarClock)
5. Missions (ClipboardList)
6. Avis recus (Star)
7. Statistiques (BarChart3)
8. Documents (FileCheck)
9. Boost (Zap)
10. Parametres (Settings)

**Features speciales :**
- Indicateur "En ligne" dans le topbar
- Bouton statut rapide (Disponible/Occupe/Indisponible)
- Niveau affiche (Starter/Certified/Expert/Elite)

### 6.3 AdminLayout

**Navigation (7 items) :**
1. Dashboard (LayoutDashboard)
2. Validation profils (UserCheck)
3. Moderation (ShieldAlert)
4. Utilisateurs (Users)
5. Analytics (BarChart3)
6. Support (Headphones)
7. Configuration (Settings)

**Features speciales :**
- Badge "alertes" sur le topbar
- Indicateur "Admin" + "Controle total"
- Menu moderation rapide

---

## 7. Carrousel 3D (Hero)

### 7.1 Implementation

Le carrousel utilise `transform-style: preserve-3d` avec 9 cartes disposees sur un cercle de 280px de rayon.

```
Angle par carte = 360 / 9 = 40deg

Carte 0 : rotateY(0deg)    translateZ(280px)
Carte 1 : rotateY(40deg)   translateZ(280px)
Carte 2 : rotateY(80deg)   translateZ(280px)
...
Carte 8 : rotateY(320deg)  translateZ(280px)
```

### 7.2 Styles cles

```css
.carousel-container {
  perspective: 1200px;
  transform-style: preserve-3d;
}

.carousel-card {
  position: absolute;
  width: 220px;
  height: 280px;
  backface-visibility: hidden;
  /* Opacity basee sur la position */
  opacity: calc(1 - var(--distance-from-front) * 0.15);
}
```

### 7.3 Proprietes

- **9 cartes** (au lieu de 18 pour la lisibilite)
- **Rayon : 280px**
- **Rotation :** 40 secondes par tour complet
- **Pause au survol**
- **Opacite** : 1.0 (devant) -> 0.35 (derriere)

---

## 8. Animations

### 8.1 Systeme de reveal (IntersectionObserver)

```css
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Delais echelonnes */
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }
.reveal-delay-5 { transition-delay: 0.5s; }
```

### 8.2 Keyframes definis

```css
@keyframes fadeIn      { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp     { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInRight{ from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes scaleIn     { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
@keyframes float       { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes shimmer     { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes pulse-glow  { 0%,100% { box-shadow: 0 0 20px rgba(212,168,83,0.1); } 50% { box-shadow: 0 0 40px rgba(212,168,83,0.25); } }
```

### 8.3 Classes d'animation

```css
.animate-fade-in    { animation: fadeIn 0.6s ease forwards; }
.animate-slide-up   { animation: slideUp 0.6s ease forwards; }
.animate-slide-left { animation: slideInLeft 0.6s ease forwards; }
.animate-slide-right{ animation: slideInRight 0.6s ease forwards; }
.animate-scale-in   { animation: scaleIn 0.5s ease forwards; }
.animate-float      { animation: float 3s ease-in-out infinite; }
.animate-shimmer    { animation: shimmer 2s linear infinite; background-size: 200% 100%; }
.animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
```

---

## 9. Composants shadcn/ui utilises

| Composant | Usage |
|-----------|-------|
| Button | Boutons d'action |
| Card | Cartes profil, statistiques |
| Input | Champs de formulaire |
| Select | Listes deroulantes |
| Dialog | Modales |
| Badge | Etiquettes (niveau, statut) |
| Avatar | Photos de profil |
| Tabs | Onglets dashboard |
| Accordion | FAQ |
| Table | Tableaux de donnees |
| Toast | Notifications |
| Tooltip | Infobulles |
| Skeleton | Chargement |
| Progress | Barres de progression |
| Slider | Sliders |
| Calendar | Calendrier |

---

## 10. Responsive Design

### 10.1 Breakpoints Tailwind

| Breakpoint | Largeur | Usage |
|------------|---------|-------|
| `sm` | 640px | Mobile paysage |
| `md` | 768px | Tablette |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Grand desktop |
| `2xl` | 1536px | Ecran large |

### 10.2 Adaptations responsive

**Navigation :**
- Desktop : Barre horizontale complete
- Mobile : Menu hamburger + overlay

**Dashboards :**
- Desktop : Sidebar fixe (240px) + contenu
- Mobile : Bottom tab bar (5 icones) + drawer

**Carrousel 3D :**
- Desktop : 9 cartes, rayon 280px
- Mobile : 5 cartes, rayon 180px

**Grilles :**
- Desktop : 3-4 colonnes
- Tablette : 2 colonnes
- Mobile : 1 colonne

---

*Document version 1.0 - Architecture Frontend*
