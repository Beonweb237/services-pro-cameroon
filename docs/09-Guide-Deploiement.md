# Services Pro Cameroon - Guide de Deploiement

## Vue d'ensemble

Ce guide couvre le deploiement complet de la plateforme : base de donnees, backend, et frontend.

---

## 1. Prerequis

### 1.1 Environnement requis

| Outil | Version | Usage |
|-------|---------|-------|
| Node.js | 20.x+ | Runtime JS |
| PostgreSQL | 15.x+ | Base de donnees |
| Redis | 7.x+ | Cache/Sessions |
| npm | 10.x+ | Gestionnaire de paquets |
| Git | 2.x+ | Versionning |

### 1.2 Services externes

| Service | Usage | Inscription |
|---------|-------|-------------|
| Cloudinary | Stockage images | https://cloudinary.com |
| Africa's Talking | SMS verification | https://africastalking.com |
| SendGrid / Gmail | Emails transactionnels | Selon le provider |

---

## 2. Configuration du Backend

### 2.1 Installation

```bash
# Cloner le repository
git clone <repository-url>
cd services-pro-cameroon/backend

# Installer les dependances
npm install

# Generer le client Prisma
npx prisma generate
```

### 2.2 Variables d'environnement

Creer le fichier `.env` :

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/servicespro?schema=public"

# JWT
JWT_ACCESS_SECRET="votre_secret_access_tres_long_et_aleatoire"
JWT_REFRESH_SECRET="votre_secret_refresh_tres_long_et_aleatoire"

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL="https://votre-frontend.vercel.app"

# Cloudinary
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"

# Email (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-app-password"

# Africa's Talking
AFRICASTALKING_API_KEY="votre_api_key"
AFRICASTALKING_USERNAME="votre_username"

# Redis
REDIS_URL="redis://localhost:6379"
```

### 2.3 Initialisation de la base de donnees

```bash
# Creer les tables
npx prisma db push

# OU avec migration
npx prisma migrate dev --name init

# Seeder les donnees
npx prisma db seed
# ou
npx tsx prisma/seed.ts
```

### 2.4 Compilation et demarrage

```bash
# Compilation TypeScript
npm run build

# Demarrage production
npm start

# OU avec PM2
pm2 start dist/index.js --name "services-pro-api"
pm2 save
pm2 startup
```

---

## 3. Configuration du Frontend

### 3.1 Installation

```bash
cd ../frontend

# Installer les dependances
npm install
```

### 3.2 Variables d'environnement

Creer le fichier `.env` :

```env
VITE_API_URL="https://votre-api.render.com/api"
VITE_SOCKET_URL="wss://votre-api.render.com"
```

### 3.3 Build production

```bash
# Compilation
npm run build

# Output dans /dist
# Deployer le contenu de /dist sur votre CDN
```

---

## 4. Deploiement avec Docker

### 4.1 Dockerfile Backend

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
RUN npx prisma generate

COPY dist ./dist/

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

### 4.2 Docker Compose

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: servicespro
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/servicespro
      REDIS_URL: redis://redis:6379
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - db
      - redis

volumes:
  postgres_data:
```

### 4.3 Commandes Docker

```bash
# Demarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f api

# Arreter
docker-compose down

# Migrations
docker-compose exec api npx prisma migrate deploy
```

---

## 5. Deploiement Cloud (Recommande)

### 5.1 Backend sur Render

1. Creer un compte sur https://render.com
2. New Web Service
3. Connecter le repository Git
4. Configurer :
   - **Build Command :** `cd backend && npm install && npm run build`
   - **Start Command :** `cd backend && npm start`
5. Ajouter les variables d'environnement
6. Deploy

### 5.2 Base de donnees sur Render

1. New PostgreSQL
2. Copier l'Internal Database URL
3. L'utiliser dans `DATABASE_URL`

### 5.3 Frontend sur Vercel

1. Creer un compte sur https://vercel.com
2. Import Git Repository
3. Configurer :
   - **Framework Preset :** Vite
   - **Root Directory :** `frontend`
   - **Build Command :** `npm run build`
   - **Output Directory :** `dist`
4. Ajouter les variables d'environnement
5. Deploy

### 5.4 Domaine personnalise

```
sous-domaine : api.servicespro.cm -> Render (backend)
sous-domaine : www.servicespro.cm -> Vercel (frontend)
```

---

## 6. Post-Deploiement

### 6.1 Verifications

```bash
# Health check
curl https://api.servicespro.cm/api/health

# Reponse attendue :
{ "status": "ok", "timestamp": "2026-01-15T10:30:00.000Z" }
```

### 6.2 Taches post-deploiement

- [ ] Verifier que l'API repond
- [ ] Tester la connexion avec les comptes demo
- [ ] Verifier l'upload d'images sur Cloudinary
- [ ] Tester l'envoi de SMS
- [ ] Verifier les emails transactionnels
- [ ] Tester Socket.io (messagerie temps reel)
- [ ] Configurer les sauvegardes BDD automatiques
- [ ] Activer le monitoring (Sentry, LogRocket)

### 6.3 Monitoring

```bash
# Logs Render
render logs --tail

# Metriques PostgreSQL
# Via Render Dashboard -> PostgreSQL -> Metrics
```

---

## 7. Mises a jour

### 7.1 Migrations de base de donnees

```bash
# Nouvelle migration
npx prisma migrate dev --name ajout_nouvelle_table

# Deploy en production
npx prisma migrate deploy
```

### 7.2 Deploiement continu

Avec GitHub Actions :

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Render
        run: |
          curl -X POST "https://api.render.com/v1/services/${{ secrets.RENDER_SERVICE_ID }}/deploys" \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}"
```

---

*Document version 1.0 - Guide de Deploiement*
