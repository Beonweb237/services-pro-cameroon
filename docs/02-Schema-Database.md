# Services Pro Cameroon - Schema Base de Donnees (Prisma)

## Vue d'ensemble

Base de donnees PostgreSQL avec 30+ modeles geres par Prisma ORM. Le schema couvre l'integralite du metier : utilisateurs, profils, categories, villes, avis, missions, messagerie, disponibilites, champs specialises, gamification, etc.

---

## Configuration Prisma

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 1. ENUMERATIONS

### 1.1 UserRole
```prisma
enum UserRole {
  client      // Client classique
  pro         // Professionnel
  support     // Agent support
  moderator   // Moderateur
  admin       // Administrateur
}
```

### 1.2 UserStatus
```prisma
enum UserStatus {
  active      // Compte actif
  suspended   // Suspendu temporairement
  banned      // Banni definitivement
  pending     // En attente de verification
}
```

### 1.3 ProLevel
```prisma
enum ProLevel {
  starter     // Nouveau (0-3 missions)
  certified   // Verifie (3+ avis, identite verifiee)
  expert      // Experimente (20+ missions, score 84+)
  elite       // D'elite (100+ missions, score 94+)
  partner     // Partenaire officiel (manuel)
}
```

### 1.4 AvailabilityStatus
```prisma
enum AvailabilityStatus {
  available     // Disponible pour missions
  busy          // En mission actuellement
  unavailable   // Indisponible (conges, etc.)
}
```

### 1.5 SpecialFieldType
```prisma
enum SpecialFieldType {
  text          // Champ texte simple
  textarea      // Zone de texte multiligne
  number        // Nombre
  url           // Lien URL
  image         // Image unique
  image_gallery // Galerie d'images
  video_url     // Lien video (YouTube, etc.)
  select        // Liste deroulante
  multiselect   // Selection multiple
  date          // Date
  boolean       // Oui/Non
}
```

### 1.6 MissionStatus
```prisma
enum MissionStatus {
  pending     // En attente d'acceptation
  accepted    // Acceptee par le pro
  in_progress // En cours
  completed   // Terminee
  cancelled   // Annulee
  disputed    // En litige
}
```

### 1.7 NotificationType
```prisma
enum NotificationType {
  new_message
  new_review
  review_reminder
  badge_unlocked
  level_up
  leaderboard_change
  report_alert
  document_expiry
  mission_update
  promotional
  subscription_reminder
  new_mission_request
  availability_change
}
```

### 1.8 ReportStatus
```prisma
enum ReportStatus {
  pending        // En attente
  investigating  // En cours d'investigation
  resolved       // Resolu
  dismissed      // Classe sans suite
}
```

### 1.9 ReportTargetType
```prisma
enum ReportTargetType {
  user    // Signalement d'utilisateur
  pro     // Signalement de professionnel
  review  // Signalement d'avis
  message // Signalement de message
}
```

### 1.10 BoostType
```prisma
enum BoostType {
  express   // Boost express 24h
  monthly   // Boost mensuel
  category  // Boost par categorie
  city      // Boost par ville
}
```

### 1.11 DocType
```prisma
enum DocType {
  identity              // Piece d'identite
  diploma               // Diplome
  professional_license  // Licence professionnelle
  insurance             // Assurance
  other                 // Autre
}
```

### 1.12 DocStatus
```prisma
enum DocStatus {
  pending   // En attente de verification
  verified  // Verifie
  rejected  // Refuse
  expired   // Expire
}
```

---

## 2. MODELES UTILISATEURS

### 2.1 User (Modele central)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK, unique | Identifiant unique |
| email | String | Unique | Email de connexion |
| password | String | - | Mot de passe hash (bcrypt) |
| phone | String? | Unique, nullable | Telephone |
| phoneVerified | DateTime? | - | Date verification tel |
| role | UserRole | Default: client | Role utilisateur |
| status | UserStatus | Default: active | Statut du compte |
| emailVerified | DateTime? | - | Date verification email |
| avatar | String? | - | URL avatar |
| cityId | String? | FK -> City | Ville de residence |
| theme | String | Default: "dark" | Preference theme |
| lastLoginAt | DateTime? | - | Derniere connexion |
| loginAttempts | Int | Default: 0 | Tentatives echouees |
| lockedUntil | DateTime? | - | Verrouillage compte |
| createdAt | DateTime | Default: now() | Date creation |
| updatedAt | DateTime | Auto updated | Date modification |

**Relations :**
- `city` -> City (optionnel)
- `proProfile` -> ProProfile (1:1, optionnel)
- `clientProfile` -> ClientProfile (1:1, optionnel)
- `sentMessages` -> Message[] (1:N, "SentMessages")
- `receivedMessages` -> Message[] (1:N, "ReceivedMessages")
- `notifications` -> Notification[] (1:N)
- `reportsMade` -> Report[] (1:N, "Reporter")
- `reportsReceived` -> Report[] (1:N, "Target")
- `refreshTokens` -> RefreshToken[] (1:N)
- `passwordResets` -> PasswordReset[] (1:N)
- `gamificationPoints` -> GamificationPoint[] (1:N)

**Table :** `users`

---

### 2.2 RefreshToken

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| userId | String | FK -> User | Proprietaire |
| token | String | Unique | Token JWT refresh |
| expiresAt | DateTime | - | Date d'expiration |
| createdAt | DateTime | Default: now() | Date creation |

**Table :** `refresh_tokens`

---

### 2.3 PasswordReset

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| userId | String | FK -> User | Proprietaire |
| token | String | Unique | Token de reset |
| expiresAt | DateTime | - | Expiration (2h) |
| usedAt | DateTime? | - | Date d'utilisation |
| createdAt | DateTime | Default: now() | Date creation |

**Table :** `password_resets`

---

## 3. MODELES PROFILS

### 3.1 ProProfile

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| userId | String | Unique, FK -> User | Lien vers User |
| title | String? | - | Titre metier |
| bio | String? | Text | Biographie |
| coverPhoto | String? | - | Photo de couverture |
| yearsExperience | Int | Default: 0 | Annees d'experience |
| languages | String[] | Default: ["francais"] | Langues parlees |
| proScore | Int | Default: 0 | Score /100 |
| avgRating | Float | Default: 0 | Note moyenne /5 |
| totalReviews | Int | Default: 0 | Nombre d'avis |
| totalMissions | Int | Default: 0 | Nombre de missions |
| responseRate | Int | Default: 0 | Taux reponse % |
| responseTimeHours | Int | Default: 0 | Temps reponse moyen |
| primarySkills | String[] | - | Competences principales |
| secondarySkills | String[] | - | Competences secondaires |
| level | ProLevel | Default: starter | Niveau |
| profileCompletion | Int | Default: 0 | Completion % |
| hourlyRateMin | Int? | - | Tarif horaire min (XAF) |
| hourlyRateMax | Int? | - | Tarif horaire max (XAF) |
| fixedPriceServices | Json? | - | Services a prix fixe |
| weeklyAvailability | Json? | - | Horaires hebdo |
| availabilityStatus | AvailabilityStatus | Default: available | Statut actuel |
| statusMessage | String? | Text | Message de statut |
| statusUntil | DateTime? | - | Statut valable jusqu'a |
| categoryId | String? | FK -> Category | Categorie |
| cityId | String? | FK -> City | Ville |
| neighborhoods | String[] | Default: [] | Quartiers desservis |
| isVerified | Boolean | Default: false | Profil verifie |
| isIdentityVerified | Boolean | Default: false | Identite verifiee |
| isActive | Boolean | Default: true | Actif |
| website | String? | - | Site web |
| facebook | String? | - | Facebook |
| instagram | String? | - | Instagram |
| linkedin | String? | - | LinkedIn |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Relations :**
- `user` -> User (1:1)
- `category` -> Category (N:1)
- `city` -> City (N:1)
- `reviews` -> Review[] (1:N)
- `missions` -> Mission[] (1:N)
- `portfolioItems` -> PortfolioItem[] (1:N)
- `verificationDocs` -> VerificationDoc[] (1:N)
- `subscriptions` -> Subscription[] (1:N)
- `boosts` -> Boost[] (1:N)
- `proBadges` -> ProBadge[] (1:N)
- `favoritesReceived` -> Favorite[] (1:N)
- `leaderboardEntries` -> LeaderboardEntry[] (1:N)
- `unavailabilityPeriods` -> UnavailabilityPeriod[] (1:N)
- `specialFieldValues` -> ProSpecialFieldValue[] (1:N)

**Indexes :** proScore, level, categoryId, cityId, isActive, availabilityStatus
**Table :** `pro_profiles`

---

### 3.2 ClientProfile

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| userId | String | Unique, FK -> User | Lien vers User |
| firstName | String? | - | Prenom |
| lastName | String? | - | Nom |
| address | String? | - | Adresse |
| preferences | Json? | - | Preferences |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Relations :**
- `user` -> User (1:1)
- `missions` -> Mission[] (1:N)
- `reviews` -> Review[] (1:N)
- `favorites` -> Favorite[] (1:N)

**Table :** `client_profiles`

---

## 4. CHAMPS SPECIALISES PAR CATEGORIE

### 4.1 CategorySpecialField

Modele permettant de definir des champs supplementaires specifiques a chaque categorie de metier.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| categoryId | String | FK -> Category | Categorie concernee |
| key | String | - | Cle technique |
| label | String | - | Libelle affiche |
| type | SpecialFieldType | - | Type de champ |
| options | Json? | - | Options (select/multiselect) |
| required | Boolean | Default: false | Obligatoire |
| order | Int | Default: 0 | Ordre d'affichage |
| helpText | String? | - | Texte d'aide |
| isActive | Boolean | Default: true | Actif |
| createdAt | DateTime | Default: now() | Creation |

**Contrainte unique :** (categoryId, key)
**Relations :** `proValues` -> ProSpecialFieldValue[]
**Table :** `category_special_fields`

---

### 4.2 ProSpecialFieldValue

Stockage des valeurs des champs specialises pour chaque professionnel.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| proId | String | FK -> ProProfile | Professionnel |
| fieldId | String | FK -> CategorySpecialField | Champ definition |
| value | Json | - | Valeur stockee |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Contrainte unique :** (proId, fieldId)
**Relations :**
- `pro` -> ProProfile
- `field` -> CategorySpecialField
**Table :** `pro_special_field_values`

---

## 5. INDISPONIBILITES

### 5.1 UnavailabilityPeriod

Periodes d'indisponibilite declarees par les professionnels.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| proId | String | FK -> ProProfile | Professionnel |
| startDate | DateTime | - | Debut |
| endDate | DateTime | - | Fin |
| reason | String? | - | Motif (conges, formation...) |
| isRecurring | Boolean | Default: false | Recurrente |
| createdAt | DateTime | Default: now() | Creation |

**Indexes :** proId, startDate
**Relations :** `pro` -> ProProfile
**Table :** `unavailability_periods`

---

## 6. VILLES & QUARTIERS

### 6.1 City

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| name | String | Unique | Nom de la ville |
| slug | String | Unique | Slug URL |
| region | String | - | Region administrative |
| population | Int? | - | Population |
| prosCount | Int | Default: 0 | Nombre de pros |
| categoriesCount | Int | Default: 0 | Nombre de categories |
| neighborhoodsCount | Int | Default: 0 | Nombre de quartiers |
| image | String? | - | Image representative |
| description | String? | Text | Description |
| topCategories | String[] | Default: [] | Top categories |
| isActive | Boolean | Default: true | Active |
| phase | Int | Default: 1 | Phase de deploiement |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Relations :**
- `neighborhoods` -> Neighborhood[]
- `pros` -> ProProfile[]
- `users` -> User[]

**Table :** `cities`

---

### 6.2 Neighborhood

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| name | String | - | Nom du quartier |
| slug | String | - | Slug URL |
| cityId | String | FK -> City | Ville parente |
| prosCount | Int | Default: 0 | Nombre de pros |
| createdAt | DateTime | Default: now() | Creation |

**Contrainte unique :** (cityId, slug)
**Relations :** `city` -> City
**Table :** `neighborhoods`

---

## 7. CATEGORIES & FAMILLES

### 7.1 ServiceFamily

Famille de metiers (ex: Batiment, Numerique, Sante...)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| name | String | Unique | Nom |
| slug | String | Unique | Slug URL |
| color | String | - | Couleur thematique |
| icon | String | - | Icone (emoji/Lucide) |
| description | String? | Text | Description |
| prosCount | Int | Default: 0 | Nombre de pros |
| order | Int | Default: 0 | Ordre d'affichage |
| createdAt | DateTime | Default: now() | Creation |

**Relations :** `categories` -> Category[]
**Table :** `service_families`

---

### 7.2 Category

Categorie de metier (ex: Plomberie, Electricite...)

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| name | String | Unique | Nom |
| slug | String | Unique | Slug URL |
| image | String? | - | Image |
| description | String? | Text | Description |
| prosCount | Int | Default: 0 | Nombre de pros |
| familyId | String | FK -> ServiceFamily | Famille |
| order | Int | Default: 0 | Ordre |
| createdAt | DateTime | Default: now() | Creation |

**Relations :**
- `family` -> ServiceFamily
- `pros` -> ProProfile[]
- `leaderboardEntries` -> LeaderboardEntry[]
- `specialFields` -> CategorySpecialField[]

**Index :** familyId
**Table :** `categories`

---

## 8. AVIS & NOTATIONS

### 8.1 Review

Systeme d'avis multi-criteres avec 5 dimensions de notation.

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| proId | String | FK -> ProProfile | Pro evalue |
| clientId | String | FK -> ClientProfile | Client evaluateur |
| qualityScore | Int | - | Qualite (1-5) |
| punctualityScore | Int | - | Ponctualite (1-5) |
| communicationScore | Int | - | Communication (1-5) |
| valueScore | Int | - | Rapport qualite/prix (1-5) |
| professionalismScore | Int | - | Professionnalisme (1-5) |
| overallScore | Float | - | Score calcule |
| comment | String? | Text | Commentaire |
| isVerified | Boolean | Default: false | Avis verifie |
| isModerated | Boolean | Default: false | Avis modere |
| moderationStatus | String | Default: "pending" | Statut moderation |
| proResponse | String? | Text | Reponse du pro |
| proResponseAt | DateTime? | - | Date reponse |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Relations :**
- `pro` -> ProProfile
- `client` -> ClientProfile
- `reports` -> Report[]

**Indexes :** proId, clientId
**Table :** `reviews`

---

## 9. MISSIONS

### 9.1 Mission

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| clientId | String | FK -> ClientProfile | Client |
| proId | String | FK -> ProProfile | Professionnel |
| title | String | - | Titre |
| description | String? | Text | Description |
| status | MissionStatus | Default: pending | Statut |
| amount | Int? | - | Montant (XAF) |
| address | String? | - | Adresse |
| scheduledAt | DateTime? | - | Date prevue |
| startedAt | DateTime? | - | Date debut |
| completedAt | DateTime? | - | Date fin |
| cancelledAt | DateTime? | - | Date annulation |
| cancelledBy | String? | - | Qui a annule |
| reviewReminderSent | Boolean | Default: false | Rappel avis envoye |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Relations :**
- `client` -> ClientProfile
- `pro` -> ProProfile
- `messages` -> Message[]

**Indexes :** clientId, proId, status
**Table :** `missions`

---

## 10. MESSAGERIE

### 10.1 Message

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| conversationId | String | - | ID conversation |
| senderId | String | FK -> User | Expediteur |
| receiverId | String | FK -> User | Destinataire |
| content | String | Text | Contenu |
| attachments | Json? | - | Pieces jointes |
| isRead | Boolean | Default: false | Lu |
| readAt | DateTime? | - | Date lecture |
| isQuoteRequest | Boolean | Default: false | Demande de devis |
| quoteDetails | Json? | - | Details du devis |
| missionId | String? | FK -> Mission | Mission liee |
| createdAt | DateTime | Default: now() | Creation |

**Relations :**
- `sender` -> User ("SentMessages")
- `receiver` -> User ("ReceivedMessages")
- `mission` -> Mission (optionnel)

**Indexes :** conversationId, senderId, receiverId
**Table :** `messages`

---

## 11. PLANS TARIFAIRES

### 11.1 PricingPlan

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| name | String | Unique | Nom (Gratuit, Pro, Expert, Elite) |
| slug | String | Unique | Slug |
| priceXaf | Int | Default: 0 | Prix mensuel (XAF) |
| commissionPercent | Int | Default: 15 | Commission (%) |
| contactsLimit | Int | Default: 5 | Limite contacts/mois |
| boostsPerMonth | Int | Default: 0 | Boosts inclus |
| features | Json | - | Liste des fonctionnalites |
| description | String? | Text | Description |
| isPopular | Boolean | Default: false | Plan populaire |
| order | Int | Default: 0 | Ordre |
| createdAt | DateTime | Default: now() | Creation |

**Relations :** `subscriptions` -> Subscription[]
**Table :** `pricing_plans`

---

### 11.2 Subscription

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| proId | String | FK -> ProProfile | Professionnel |
| planId | String | FK -> PricingPlan | Plan |
| status | String | Default: "active" | Statut |
| startsAt | DateTime | Default: now() | Debut |
| expiresAt | DateTime? | - | Fin |
| cancelledAt | DateTime? | - | Date annulation |
| autoRenew | Boolean | Default: true | Renouvellement auto |
| paymentMethod | String? | - | Methode de paiement |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Indexes :** proId, planId
**Relations :**
- `pro` -> ProProfile
- `plan` -> PricingPlan
**Table :** `subscriptions`

---

## 12. NOTIFICATIONS

### 12.1 Notification

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| userId | String | FK -> User | Destinataire |
| type | NotificationType | - | Type |
| title | String | - | Titre |
| content | String | Text | Contenu |
| data | Json? | - | Donnees supplementaires |
| isRead | Boolean | Default: false | Lu |
| readAt | DateTime? | - | Date lecture |
| createdAt | DateTime | Default: now() | Creation |

**Indexes :** userId, type
**Relations :** `user` -> User
**Table :** `notifications`

---

## 13. SIGNALEMENTS

### 13.1 Report

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| reporterId | String | FK -> User | Signaleur |
| targetId | String | - | Cible signalee |
| targetType | ReportTargetType | - | Type de cible |
| reason | String | - | Raison |
| description | String? | Text | Description |
| status | ReportStatus | Default: pending | Statut |
| priority | String | Default: "normal" | Priorite |
| resolvedAt | DateTime? | - | Date resolution |
| resolvedBy | String? | - | Resolu par |
| resolution | String? | Text | Resolution |
| reviewId | String? | FK -> Review | Avis lie |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Relations :**
- `reporter` -> User ("Reporter")
- `review` -> Review (optionnel)

**Indexes :** reporterId, targetId, status, priority
**Table :** `reports`

---

## 14. BOOSTS

### 14.1 Boost

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| proId | String | FK -> ProProfile | Professionnel |
| type | BoostType | - | Type de boost |
| targetId | String? | - | Cible (categorie/ville) |
| startsAt | DateTime | Default: now() | Debut |
| expiresAt | DateTime | - | Fin |
| isActive | Boolean | Default: true | Actif |
| createdAt | DateTime | Default: now() | Creation |

**Indexes :** proId, isActive
**Relations :** `pro` -> ProProfile
**Table :** `boosts`

---

## 15. BADGES & GAMIFICATION

### 15.1 Badge

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| name | String | Unique | Nom |
| slug | String | Unique | Slug |
| description | String? | Text | Description |
| icon | String | - | Icone |
| color | String | - | Couleur |
| condition | String | - | Condition d'obtention |
| createdAt | DateTime | Default: now() | Creation |

**Relations :** `proBadges` -> ProBadge[]
**Table :** `badges`

---

### 15.2 ProBadge

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| proId | String | FK -> ProProfile | Professionnel |
| badgeId | String | FK -> Badge | Badge |
| awardedAt | DateTime | Default: now() | Date attribution |

**Contrainte unique :** (proId, badgeId)
**Relations :**
- `pro` -> ProProfile
- `badge` -> Badge
**Table :** `pro_badges`

---

### 15.3 GamificationPoint

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| userId | String | FK -> User | Utilisateur |
| action | String | - | Action realisee |
| points | Int | - | Points gagnes |
| description | String? | - | Description |
| createdAt | DateTime | Default: now() | Creation |

**Index :** userId
**Relations :** `user` -> User
**Table :** `gamification_points`

---

## 16. DOCUMENTS DE VERIFICATION

### 16.1 VerificationDoc

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| proId | String | FK -> ProProfile | Professionnel |
| type | DocType | - | Type de document |
| fileUrl | String | - | URL du fichier |
| fileName | String | - | Nom du fichier |
| status | DocStatus | Default: pending | Statut |
| reviewedAt | DateTime? | - | Date verification |
| reviewedBy | String? | - | Verifie par |
| notes | String? | Text | Notes |
| expiryDate | DateTime? | - | Date d'expiration |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Indexes :** proId, status
**Relations :** `pro` -> ProProfile
**Table :** `verification_docs`

---

## 17. PORTFOLIO

### 17.1 PortfolioItem

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| proId | String | FK -> ProProfile | Professionnel |
| title | String | - | Titre |
| description | String? | Text | Description |
| imageUrl | String | - | Image |
| category | String? | - | Categorie |
| beforeImage | String? | - | Image avant |
| afterImage | String? | - | Image apres |
| isFeatured | Boolean | Default: false | Mis en avant |
| order | Int | Default: 0 | Ordre |
| createdAt | DateTime | Default: now() | Creation |

**Index :** proId
**Relations :** `pro` -> ProProfile
**Table :** `portfolio_items`

---

## 18. FAVORIS

### 18.1 Favorite

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| clientId | String | FK -> ClientProfile | Client |
| proId | String | FK -> ProProfile | Professionnel |
| createdAt | DateTime | Default: now() | Creation |

**Contrainte unique :** (clientId, proId)
**Relations :**
- `client` -> ClientProfile
- `pro` -> ProProfile
**Table :** `favorites`

---

## 19. LEADERBOARD

### 19.1 LeaderboardEntry

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| proId | String | FK -> ProProfile | Professionnel |
| categoryId | String? | FK -> Category | Categorie |
| cityId | String? | - | Ville |
| period | String | Default: "monthly" | Periode |
| rank | Int | - | Classement |
| previousRank | Int? | - | Classement precedent |
| proScore | Int | - | Score |
| totalMissions | Int | Default: 0 | Missions |
| totalReviews | Int | Default: 0 | Avis |
| periodStart | DateTime | - | Debut periode |
| periodEnd | DateTime | - | Fin periode |
| createdAt | DateTime | Default: now() | Creation |

**Indexes :** rank, period
**Relations :**
- `pro` -> ProProfile
- `category` -> Category (optionnel)
**Table :** `leaderboard_entries`

---

## 20. BLOG & CONTENU

### 20.1 BlogPost

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| title | String | - | Titre |
| slug | String | Unique | Slug URL |
| excerpt | String? | Text | Resume |
| content | String | Text | Contenu |
| coverImage | String? | - | Image couverture |
| authorId | String | - | ID auteur |
| authorName | String | - | Nom auteur |
| category | String | - | Categorie |
| tags | String[] | Default: [] | Tags |
| isPublished | Boolean | Default: false | Publie |
| publishedAt | DateTime? | - | Date publication |
| viewCount | Int | Default: 0 | Vues |
| seoTitle | String? | - | Titre SEO |
| seoDescription | String? | Text | Description SEO |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Indexes :** slug, category, isPublished
**Table :** `blog_posts`

---

## 21. FAQ

### 21.1 FAQ

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| question | String | - | Question |
| answer | String | Text | Reponse |
| category | String | Default: "general" | Categorie |
| order | Int | Default: 0 | Ordre |
| isActive | Boolean | Default: true | Active |
| createdAt | DateTime | Default: now() | Creation |
| updatedAt | DateTime | Auto updated | Modification |

**Table :** `faqs`

---

## 22. TEMOIGNAGES

### 22.1 Testimonial

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| clientName | String | - | Nom client |
| clientAvatar | String? | - | Avatar client |
| clientCity | String? | - | Ville client |
| proName | String | - | Nom pro |
| proCategory | String? | - | Categorie pro |
| proAvatar | String? | - | Avatar pro |
| rating | Int | - | Note |
| comment | String | Text | Commentaire |
| isActive | Boolean | Default: true | Active |
| order | Int | Default: 0 | Ordre |
| createdAt | DateTime | Default: now() | Creation |

**Table :** `testimonials`

---

## 23. CONFIGURATION PLATEFORME

### 23.1 PlatformConfig

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| id | String (CUID) | PK | Identifiant |
| key | String | Unique | Cle de configuration |
| value | Json | - | Valeur (JSON) |
| updatedAt | DateTime | Auto updated | Modification |

**Table :** `platform_config`

---

## Resume des Tables

| # | Table | Description | Lignes estimees |
|---|-------|-------------|-----------------|
| 1 | users | Utilisateurs | ~50K |
| 2 | refresh_tokens | Tokens de rafraichissement | ~150K |
| 3 | password_resets | Resets de mot de passe | ~500 |
| 4 | pro_profiles | Profils professionnels | ~5K |
| 5 | client_profiles | Profils clients | ~45K |
| 6 | category_special_fields | Champs specialises | ~200 |
| 7 | pro_special_field_values | Valeurs champs specialises | ~10K |
| 8 | unavailability_periods | Periodes d'indisponibilite | ~2K |
| 9 | cities | Villes | 14 |
| 10 | neighborhoods | Quartiers | ~200 |
| 11 | service_families | Familles de metiers | 10 |
| 12 | categories | Categories | ~80 |
| 13 | reviews | Avis | ~25K |
| 14 | missions | Missions | ~15K |
| 15 | messages | Messages | ~100K |
| 16 | pricing_plans | Plans tarifaires | 4 |
| 17 | subscriptions | Abonnements | ~3K |
| 18 | notifications | Notifications | ~200K |
| 19 | reports | Signalements | ~500 |
| 20 | boosts | Boosts | ~1K |
| 21 | badges | Badges | ~20 |
| 22 | pro_badges | Badges attribues | ~8K |
| 23 | gamification_points | Points gamification | ~50K |
| 24 | verification_docs | Documents de verification | ~10K |
| 25 | portfolio_items | Elements portfolio | ~20K |
| 26 | favorites | Favoris | ~30K |
| 27 | leaderboard_entries | Entrees classement | ~500/mois |
| 28 | blog_posts | Articles blog | ~50 |
| 29 | faqs | FAQ | ~30 |
| 30 | testimonials | Temoignages | ~20 |
| 31 | platform_config | Configuration | ~10 |

**Total : 31 tables, 12 enumerations**

---

*Document version 1.0 - Schema Prisma complet*
