# Services Pro Cameroon - Specification API REST

## Vue d'ensemble

API RESTful construite avec Express.js et TypeScript. Toutes les reponses suivent le format standardise `ApiResponse<T>`. Base URL : `/api`.

---

## Format des Reponses

### Reponse succes (2xx)
```json
{
  "success": true,
  "data": { ... },
  "message": "Optionnel"
}
```

### Reponse avec pagination
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Reponse erreur (4xx/5xx)
```json
{
  "success": false,
  "message": "Description de l'erreur"
}
```

---

## 1. AUTHENTIFICATION

Base path : `/api/auth`

### 1.1 Inscription Client

```
POST /api/auth/register/client
```

**Body (JSON) :**
```json
{
  "email": "client@email.com",
  "password": "MotDePasse123",
  "phone": "+237 6XX XXX XXX",
  "firstName": "Jean",
  "lastName": "Dupont",
  "cityId": "cuid-douala"
}
```

**Validation Zod :**
- `email` : email valide
- `password` : min 8 caracteres, 1 majuscule, 1 minuscule, 1 chiffre
- `phone` : min 9 caracteres
- `firstName` : min 1 caractere
- `lastName` : min 1 caractere
- `cityId` : optionnel

**Reponse (201) :**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "client", "phone": "...", "clientProfile": { ... } },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Erreurs :**
- `409` : Email deja utilise
- `400` : Donnees invalides (validation Zod)

---

### 1.2 Inscription Professionnel

```
POST /api/auth/register/pro
```

**Body (JSON) :**
```json
{
  "email": "pro@email.com",
  "password": "MotDePasse123",
  "phone": "+237 6XX XXX XXX",
  "fullName": "Jean Kouam",
  "categoryId": "cuid-plomberie",
  "cityId": "cuid-douala",
  "title": "Plombier Professionnel",
  "bio": "Expert en plomberie...",
  "hourlyRateMin": 5000,
  "hourlyRateMax": 25000,
  "languages": ["francais", "anglais"],
  "primarySkills": ["Depannage", "Installation"],
  "yearsExperience": 10
}
```

**Validation Zod :**
- `email`, `password`, `phone` : meme validation que client
- `fullName` : min 2 caracteres
- `categoryId`, `cityId` : obligatoires
- `title` : min 2 caracteres
- `bio` : max 600 caracteres (optionnel)
- `hourlyRateMin/Max` : nombres (optionnels)
- `languages` : tableau, defaut ["francais"]
- `primarySkills` : tableau, defaut []
- `yearsExperience` : nombre, defaut 0

**Reponse (201) :** Idem inscription client avec `proProfile` au lieu de `clientProfile`

**Calcul completion profil :**
- Base : 40% (email, password, phone, nom)
- +20% si bio > 100 caracteres
- +20% si tarifs definis
- +20% si skills renseignes
- Activation si completion >= 60%

---

### 1.3 Connexion

```
POST /api/auth/login
```

**Body (JSON) :**
```json
{
  "email": "client@demo.com",
  "password": "Demo1234"
}
```

**Validation Zod :**
- `email` : email valide
- `password` : min 1 caractere

**Reponse (200) :**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "...",
      "role": "client|pro|admin|moderator|support",
      "phone": "...",
      "avatar": "...",
      "proProfile": { ... },
      "clientProfile": { ... }
    },
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

**Erreurs :**
- `401` : Email ou mot de passe incorrect
- `423` : Compte temporairement verrouille

---

### 1.4 Rafraichir le token

```
POST /api/auth/refresh
```

**Body (JSON) :**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Reponse (200) :**
```json
{
  "success": true,
  "data": {
    "accessToken": "nouveau_jwt_access_token"
  }
}
```

**Erreurs :**
- `401` : Refresh token manquant, invalide ou expire

---

### 1.5 Deconnexion

```
DELETE /api/auth/logout
```

**Headers :**
```
Authorization: Bearer <access_token>
```

**Reponse (200) :**
```json
{
  "success": true,
  "message": "Deconnecte"
}
```

---

### 1.6 Profil connecte (Me)

```
GET /api/auth/me
```

**Headers :**
```
Authorization: Bearer <access_token>
```

**Reponse (200) :**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "...",
    "role": "...",
    "phone": "...",
    "avatar": "...",
    "theme": "dark",
    "proProfile": {
      "category": { ... },
      "city": { ... },
      "proBadges": [ { "badge": { ... } } ],
      "subscriptions": [ { "plan": { ... } } ]
    },
    "clientProfile": { ... },
    "city": { ... }
  }
}
```

---

### 1.7 Verification telephone

```
POST /api/auth/verify-phone
```

**Body (JSON) :**
```json
{
  "phone": "+237 6XX XXX XXX",
  "code": "123456"
}
```

> **Note** : Le code "123456" est accepte en mode developpement. En production, integration avec Africa's Talking.

**Reponse (200) :**
```json
{
  "success": true,
  "message": "Telephone verifie"
}
```

---

### 1.8 Mot de passe oublie

```
POST /api/auth/forgot-password
```

**Body (JSON) :**
```json
{
  "email": "user@email.com"
}
```

**Reponse (200) :**
```json
{
  "success": true,
  "message": "Si cet email existe, un lien a ete envoye"
}
```

> **Securite** : La reponse est identique que l'email existe ou non pour eviter l'enumeration.

---

### 1.9 Reinitialisation mot de passe

```
POST /api/auth/reset-password
```

**Body (JSON) :**
```json
{
  "token": "reset_token",
  "newPassword": "NouveauMotDePasse123"
}
```

**Reponse (200) :**
```json
{
  "success": true,
  "message": "Mot de passe mis a jour"
}
```

---

## 2. PROFESSIONNELS

Base path : `/api/pros`

### 2.1 Liste des professionnels (avec filtres)

```
GET /api/pros
```

**Query Parameters :**

| Parametre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| page | number | Page courante | `1` |
| limit | number | Items par page (max 50) | `20` |
| cityId | string | Filtre par ville | `cuid-douala` |
| categoryId | string | Filtre par categorie | `cuid-plomberie` |
| familyId | string | Filtre par famille | `cuid-batiment` |
| minScore | number | Score minimum | `80` |
| maxPrice | number | Prix horaire max | `50000` |
| level | string | Niveau (starter/certified/expert/elite/partner) | `expert` |
| search | string | Recherche texte | `plombier` |
| availability | string | `now` pour disponibles | `now` |
| sortBy | string | Colonne de tri (proScore/avgRating/hourlyRateMin/createdAt) | `proScore` |
| sortOrder | string | `asc` ou `desc` | `desc` |

**Reponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Plombier Professionnel",
      "proScore": 96,
      "avgRating": 4.9,
      "hourlyRateMin": 5000,
      "hourlyRateMax": 25000,
      "level": "elite",
      "isAvailableNow": true,
      "user": { "id": "...", "email": "...", "avatar": "...", "phone": "..." },
      "category": { "name": "Plomberie", "family": { "name": "Batiment" } },
      "city": { "name": "Douala" },
      "proBadges": [ ... ],
      "_count": { "reviews": 48, "missions": 156 }
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 150, "totalPages": 8 }
}
```

---

### 2.2 Profils en vedette (Pros du moment)

```
GET /api/pros/featured
```

**Description :** Retourne les 9 meilleurs profils (Expert/Elite/Partner)

**Reponse (200) :**
```json
{
  "success": true,
  "data": [ { ...profil pro complet... } ]
}
```

---

### 2.3 Leaderboard

```
GET /api/pros/leaderboard
```

**Query Parameters :**

| Parametre | Type | Description |
|-----------|------|-------------|
| categoryId | string | Filtre par categorie |
| cityId | string | Filtre par ville |
| period | string | `weekly`, `monthly`, `yearly` (defaut: monthly) |

**Reponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "previousRank": 2,
      "proScore": 98,
      "totalMissions": 200,
      "totalReviews": 85,
      "pro": { "user": { "avatar": "..." }, "category": { ... }, "city": { ... } }
    }
  ]
}
```

---

### 2.4 Detail d'un professionnel

```
GET /api/pros/:id
```

**Headers (optionnel) :**
```
Authorization: Bearer <access_token>
```

**Reponse (200) :**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "title": "...",
    "bio": "...",
    "proScore": 96,
    "avgRating": 4.9,
    "hourlyRateMin": 5000,
    "hourlyRateMax": 25000,
    "yearsExperience": 10,
    "languages": ["francais", "anglais"],
    "primarySkills": ["Depannage", "Installation"],
    "level": "elite",
    "isVerified": true,
    "availabilityStatus": "available",
    "statusMessage": "Disponible pour vos projets",
    "user": { "id": "...", "email": "...", "avatar": "...", "phone": "...", "createdAt": "..." },
    "category": { "name": "Plomberie", "family": { "name": "Batiment", "color": "..." } },
    "city": { "name": "Douala", "region": "Littoral" },
    "proBadges": [ { "badge": { "name": "...", "icon": "...", "color": "..." } } ],
    "portfolioItems": [ { "title": "...", "imageUrl": "...", "beforeImage": "...", "afterImage": "..." } ],
    "verificationDocs": [ { "type": "professional_license", "status": "verified" } ],
    "subscriptions": [ { "plan": { "name": "Expert", "priceXaf": 15000 } } ],
    "_count": { "reviews": 48, "missions": 156 },
    "reviews": [
      {
        "qualityScore": 5,
        "punctualityScore": 5,
        "communicationScore": 5,
        "valueScore": 4,
        "professionalismScore": 5,
        "overallScore": 4.8,
        "comment": "Excellent travail !",
        "client": { "id": "...", "email": "...", "avatar": "..." },
        "createdAt": "2026-01-15T10:30:00Z"
      }
    ]
  }
}
```

---

### 2.5 Mise a jour d'un profil pro

```
PUT /api/pros/:id
```

**Headers :**
```
Authorization: Bearer <access_token>
```

**Body (JSON) - Tous les champs optionnels :**
```json
{
  "title": "Plombier Expert",
  "bio": "Nouvelle bio...",
  "yearsExperience": 12,
  "languages": ["francais", "anglais"],
  "primarySkills": ["Depannage", "Installation", "Renovation"],
  "secondarySkills": ["Chauffage"],
  "hourlyRateMin": 8000,
  "hourlyRateMax": 35000,
  "fixedPriceServices": { "debouchage": 15000 },
  "availability": { "lundi": [{ "start": "08:00", "end": "18:00" }] },
  "isAvailableNow": true,
  "categoryId": "cuid-plomberie",
  "cityId": "cuid-douala",
  "neighborhoods": ["Akwa", "Bonapriso"],
  "website": "https://monsite.com",
  "facebook": "https://fb.com/...",
  "instagram": "https://instagram.com/...",
  "linkedin": "https://linkedin.com/..."
}
```

**Autorisation :** Le pro lui-meme OU un admin

**Reponse (200) :**
```json
{
  "success": true,
  "data": { ...profil mis a jour... }
}
```

---

## 3. AVIS

Base path : `/api/reviews`

### 3.1 Creer un avis

```
POST /api/reviews
```

**Headers :**
```
Authorization: Bearer <access_token>
```

**Body (JSON) :**
```json
{
  "proId": "cuid-pro",
  "qualityScore": 5,
  "punctualityScore": 4,
  "communicationScore": 5,
  "valueScore": 4,
  "professionalismScore": 5,
  "comment": "Excellent service, tres professionnel !"
}
```

**Reponse (201) :** Avis cree + recalcul ProScore automatique

---

### 3.2 Liste des avis d'un pro

```
GET /api/reviews?proId=cuid-pro&page=1&limit=10
```

---

### 3.3 Repondre a un avis

```
POST /api/reviews/:id/response
```

**Body (JSON) :**
```json
{
  "response": "Merci pour votre confiance !"
}
```

---

## 4. VILLES

Base path : `/api/cities`

### 4.1 Liste des villes

```
GET /api/cities
```

**Reponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Douala",
      "slug": "douala",
      "region": "Littoral",
      "population": 2760000,
      "prosCount": 1240,
      "categoriesCount": 18,
      "phase": 1,
      "topCategories": ["Plomberie", "Electricite", "Coiffure"]
    }
  ]
}
```

### 4.2 Detail d'une ville

```
GET /api/cities/:slug
```

---

### 4.3 Quartiers d'une ville

```
GET /api/cities/:id/neighborhoods
```

---

## 5. CATEGORIES

Base path : `/api`

### 5.1 Liste des familles de services

```
GET /api/families
```

**Reponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Batiment",
      "slug": "batiment",
      "color": "#D4A853",
      "icon": "hammer",
      "description": "...",
      "categories": [
        { "id": "...", "name": "Plomberie", "slug": "plomberie", "prosCount": 180 }
      ]
    }
  ]
}
```

### 5.2 Liste des categories

```
GET /api/categories
```

### 5.3 Champs specialises d'une categorie

```
GET /api/categories/:id/special-fields
```

**Reponse (200) :**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "key": "portfolio_photos",
      "label": "Photos de realisations",
      "type": "image_gallery",
      "required": true,
      "helpText": "Ajoutez des photos de vos travaux"
    }
  ]
}
```

---

## 6. MESSAGERIE

Base path : `/api/messages`

### 6.1 Envoyer un message

```
POST /api/messages
```

**Headers :**
```
Authorization: Bearer <access_token>
```

**Body (JSON) :**
```json
{
  "receiverId": "cuid-user",
  "content": "Bonjour, etes-vous disponible demain ?",
  "conversationId": "conv-123",
  "isQuoteRequest": false
}
```

### 6.2 Conversations

```
GET /api/messages/conversations
```

### 6.3 Messages d'une conversation

```
GET /api/messages/:conversationId
```

### 6.4 Marquer comme lu

```
PATCH /api/messages/:id/read
```

---

## 7. ADMINISTRATION

Base path : `/api/admin`

Toutes les routes necessitent le role `admin` ou `moderator`.

### 7.1 Statistiques globales

```
GET /api/admin/stats
```

**Reponse (200) :**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1240,
    "totalPros": 520,
    "totalClients": 720,
    "pendingVerifications": 12,
    "activeMissions": 45,
    "totalReviews": 3200,
    "averageProScore": 72,
    "alertsCount": 3,
    "supportMessages": 8
  }
}
```

### 7.2 Profils en attente de validation

```
GET /api/admin/pending-profiles
```

### 7.3 Valider un profil

```
POST /api/admin/validate-profile/:id
```

**Body (JSON) :**
```json
{
  "action": "approve",
  "notes": "Profil complet et verifie"
}
```

### 7.4 Liste des utilisateurs

```
GET /api/admin/users?page=1&limit=50&role=pro&status=active
```

### 7.5 Signalements

```
GET /api/admin/reports?status=pending
```

### 7.6 Resoudre un signalement

```
POST /api/admin/reports/:id/resolve
```

**Body (JSON) :**
```json
{
  "resolution": "Contenu supprime, avertissement envoye",
  "action": "warn_user"
}
```

---

## 8. FAVORIS

### 8.1 Ajouter aux favoris

```
POST /api/favorites
```

**Body (JSON) :**
```json
{
  "proId": "cuid-pro"
}
```

### 8.2 Liste des favoris

```
GET /api/favorites
```

### 8.3 Supprimer un favori

```
DELETE /api/favorites/:proId
```

---

## 9. NOTIFICATIONS

### 9.1 Liste des notifications

```
GET /api/notifications
```

### 9.2 Marquer comme lu

```
PATCH /api/notifications/:id/read
```

### 9.3 Marquer tout comme lu

```
PATCH /api/notifications/read-all
```

---

## 10. UPLOAD

### 10.1 Upload d'image

```
POST /api/upload
```

**Content-Type :** `multipart/form-data`

**Body :**
```
file: <fichier image>
folder: "profiles|portfolio|documents|avatars"
```

**Reponse (200) :**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "profiles/abc123"
  }
}
```

---

## Middleware d'Authentification

### authenticate
Verifie le Bearer token JWT. Retourne 401 si invalide, 403 si banni/suspendu.

### optionalAuth
Authentification optionnelle. N'echec pas si pas de token.

### requireRole(...roles)
Verifie que l'utilisateur a l'un des roles specifies.

**Exemple d'utilisation :**
```typescript
router.get('/admin-only', authenticate, requireRole('admin'), handler);
router.get('/modo-or-admin', authenticate, requireRole('admin', 'moderator'), handler);
```

---

## Codes d'Erreur HTTP

| Code | Signification | Contexte |
|------|---------------|----------|
| 200 | OK | Requete reussie |
| 201 | Created | Ressource creee |
| 400 | Bad Request | Donnees invalides |
| 401 | Unauthorized | Authentification requise |
| 403 | Forbidden | Acces interdit (role) |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Conflit (email duplique) |
| 422 | Unprocessable | Validation Zod echouee |
| 423 | Locked | Compte verrouille |
| 429 | Too Many Requests | Rate limiting |
| 500 | Server Error | Erreur serveur |

---

*Document version 1.0 - Specification API REST*
