# Services Pro Cameroon - Tests & Comptes Demo

## Vue d'ensemble

Ce document recapitule les comptes de demonstration, les scenarios de test, et les procedures de validation de la plateforme.

---

## 1. Comptes de Demonstration

### 1.1 Acces rapide

| Compte | Email | Mot de passe | Role | Dashboard |
|--------|-------|-------------|------|-----------|
| **Client** | `client@demo.com` | `Demo1234` | client | `/client/dashboard` |
| **Professionnel** | `pro@demo.com` | `Demo1234` | pro | `/pro/dashboard` |
| **Administrateur** | `admin@demo.com` | `Demo1234` | admin | `/admin/dashboard` |

### 1.2 Donnees du compte Client

```json
{
  "id": "demo-client-001",
  "email": "client@demo.com",
  "role": "client",
  "phone": "+237 6XX XXX XXX",
  "firstName": "Jean",
  "lastName": "Dupont",
  "address": "Douala, Akwa",
  "avatar": null,
  "cityId": "douala",
  "missionsCount": 8,
  "favoritesCount": 5,
  "reviewsCount": 6,
  "messagesUnread": 3
}
```

### 1.3 Donnees du compte Pro

```json
{
  "id": "demo-pro-001",
  "email": "pro@demo.com",
  "role": "pro",
  "phone": "+237 6XX XXX XXX",
  "title": "Plombier Professionnel",
  "bio": "Expert en plomberie residentielle et commerciale avec plus de 10 ans d'experience.",
  "yearsExperience": 10,
  "languages": ["Francais", "Anglais"],
  "proScore": 96,
  "avgRating": 4.9,
  "totalReviews": 48,
  "totalMissions": 156,
  "responseRate": 98,
  "responseTimeHours": 2,
  "level": "elite",
  "profileCompletion": 95,
  "hourlyRateMin": 5000,
  "hourlyRateMax": 25000,
  "primarySkills": ["Depannage", "Installation", "Renovation"],
  "secondarySkills": ["Chauffage", "Pompe a chaleur"],
  "category": "Plomberie",
  "city": "Douala",
  "isVerified": true,
  "isAvailableNow": true,
  "availabilityStatus": "available",
  "badges": ["Expert", "Top Rated", "Rapide"],
  "subscribers": 120
}
```

### 1.4 Donnees du compte Admin

```json
{
  "id": "demo-admin-001",
  "email": "admin@demo.com",
  "role": "admin",
  "permissions": ["all"],
  "stats": {
    "totalUsers": 1240,
    "totalPros": 520,
    "pendingVerifications": 12,
    "alertsCount": 3,
    "supportMessages": 8
  }
}
```

---

## 2. Scenarios de Test

### 2.1 Parcours Client

#### Test 1 : Recherche d'un professionnel

```
1. Acceder a la page d'accueil
2. Saisir "plombier" dans la barre de recherche
3. Selectionner "Douala" comme ville
4. Cliquer sur "Rechercher"
5. RESULTAT ATTENDU : Liste de plombiers a Douala
   - Cartes avec photo, nom, score, note, tarif
   - Filtres disponibles (disponibilite, prix, niveau)
   - Trier par pertinence / score / prix
```

#### Test 2 : Consultation profil pro

```
1. Depuis les resultats de recherche
2. Cliquer sur une carte de professionnel
3. RESULTAT ATTENDU :
   - Photo de profil, nom, titre
   - Pro Score avec barre de progression
   - Note moyenne et nombre d'avis
   - Bio et competences
   - Portfolio photos
   - Horaires de disponibilite
   - Bouton "Contacter"
   - Avis clients
```

#### Test 3 : Connexion et espace client

```
1. Aller sur /login
2. Cliquer sur le bouton "Client"
3. Les champs se remplissent automatiquement
4. Cliquer "Se connecter"
5. RESULTAT ATTENDU :
   - Redirection vers /client/dashboard
   - Sidebar avec 6 items de navigation
   - Statistiques : missions, messages, favoris, avis
   - Missions recentes avec statuts
   - Professionnels recommandes
```

#### Test 4 : Ajout aux favoris

```
1. Depuis la recherche, cliquer sur [coeur] sur une carte
2. Verifier dans /client/favoris
3. RESULTAT ATTENDU : Le pro apparait dans les favoris
```

---

### 2.2 Parcours Professionnel

#### Test 5 : Connexion espace pro

```
1. Aller sur /login
2. Cliquer sur le bouton "Pro"
3. Se connecter
4. RESULTAT ATTENDU :
   - Redirection vers /pro/dashboard
   - Sidebar avec 10 items
   - Pro Score : 96
   - Vues profil : 1,240
   - Messages : 8
   - Missions : 12
   - Niveau : Elite (badge dore)
   - Indicateur "En ligne"
```

#### Test 6 : Gestion des disponibilites

```
1. Depuis le dashboard pro
2. Cliquer sur "Disponibilites" dans la sidebar
3. RESULTAT ATTENDU :
   - Statut actuel : Disponible (vert)
   - Boutons pour changer de statut
   - Horaires hebdomadaires par jour
   - Liste des periodes d'indisponibilite
   
   ACTIONS :
   a. Changer le statut en "Occupe"
      -> La couleur passe a orange
   b. Desactiver un jour dans les horaires
      -> Le toggle passe a OFF
   c. Ajouter une periode d'indisponibilite
      -> Formulaire avec dates + motif
   d. Supprimer une periode
      -> Confirmation + suppression
```

#### Test 7 : Edition du profil

```
1. Depuis le dashboard pro
2. Cliquer sur "Mon profil"
3. RESULTAT ATTENDU :
   - Formulaire pre-rempli
   - Champs : titre, bio, tarifs, competences
   - Upload photo de profil
   - Champs specialises selon la categorie
   
   ACTIONS :
   a. Modifier le titre
   b. Ajouter une competence
   c. Changer les tarifs
   d. Sauvegarder -> Toast de confirmation
```

---

### 2.3 Parcours Administrateur

#### Test 8 : Connexion espace admin

```
1. Aller sur /login
2. Cliquer sur le bouton "Admin"
3. Se connecter
4. RESULTAT ATTENDU :
   - Redirection vers /admin/dashboard
   - Sidebar avec 7 items
   - Statistiques globales
   - Graphiques d'utilisation
   - Alertes recentes
```

#### Test 9 : Validation des profils

```
1. Depuis /admin/dashboard
2. Cliquer sur "Validation des profils"
3. RESULTAT ATTENDU :
   - Liste des profils en attente
   - Pour chaque profil :
     * Informations du candidat
     * Documents soumis
     * Boutons "Approuver" / "Rejeter"
   
   ACTIONS :
   a. Approuver un profil
      -> Statut change a "actif"
      -> Email de confirmation envoye
   b. Rejeter un profil
      -> Champ motif obligatoire
      -> Email de notification envoye
```

#### Test 10 : Moderation

```
1. Depuis /admin/dashboard
2. Cliquer sur "Moderation"
3. RESULTAT ATTENDU :
   - Signalements recents
   - Avis signales
   - Messages suspects
   
   ACTIONS :
   a. Consulter un signalement
   b. Prendre une action :
      - Avertir l'utilisateur
      - Supprimer le contenu
      - Suspendre le compte
      - Classer sans suite
```

---

### 2.4 Tests Transversaux

#### Test 11 : Theme clair/sombre

```
1. Sur n'importe quelle page
2. Cliquer sur l'icone lune/soleil dans la nav
3. RESULTAT ATTENDU :
   - Le theme change instantanement
   - Toutes les couleurs s'inversent
   - Le choix persiste au rechargement
   - Le choix est memorise dans localStorage
```

#### Test 12 : Responsive mobile

```
1. Redimensionner la fenetre < 768px
2. RESULTAT ATTENDU :
   - Navigation : menu hamburger
   - Dashboards : bottom tab bar
   - Carrousel : adapte au format
   - Grilles : 1 colonne
   - Formulaires : pleine largeur
```

#### Test 13 : Deconnexion

```
1. Etre connecte (n'importe quel role)
2. Cliquer "Deconnexion"
3. RESULTAT ATTENDU :
   - Redirection vers la page d'accueil
   - Le bouton "Connexion" reapparait
   - Les donnees utilisateur sont effacees
   - Le localStorage est nettoye
```

---

## 3. Checklist de Validation Pre-Production

### 3.1 Fonctionnalites critiques

- [ ] Connexion / Inscription client
- [ ] Connexion / Inscription pro
- [ ] Recherche avec filtres
- [ ] Affichage profil pro
- [ ] Contact via messagerie
- [ ] Depot d'avis
- [ ] Ajout aux favoris
- [ ] Dashboard client complet
- [ ] Dashboard pro complet
- [ ] Gestion disponibilites
- [ ] Dashboard admin complet
- [ ] Validation profils
- [ ] Moderation contenu

### 3.2 Securite

- [ ] Mots de passe hashés
- [ ] JWT avec expiration
- [ ] Protection routes admin
- [ ] Rate limiting
- [ ] Validation des inputs
- [ ] Upload securise

### 3.3 Performance

- [ ] Chargement initial < 3s
- [ ] Recherche < 500ms
- [ ] Images optimisees
- [ ] Animations fluides (60fps)
- [ ] Pas de fuites memoire

### 3.4 UX/UI

- [ ] Theme clair/sombre fonctionnel
- [ ] Responsive mobile/tablette/desktop
- [ ] Animations coherentes
- [ ] Messages d'erreur clairs
- [ ] Feedback utilisateur (toasts, loaders)
- [ ] Accessibilite (contrastes, ARIA)

---

## 4. Commandes de Test

### 4.1 Tests backend

```bash
# Lancer les tests
cd backend
npm test

# Tests avec couverture
npm run test:coverage

# Tests d'integration
npm run test:integration
```

### 4.2 Tests frontend

```bash
cd frontend
npm test

# Tests E2E (Playwright)
npx playwright test
```

### 4.3 Tests manuels

```bash
# Lancer le projet en local
npm run dev

# Backend
http://localhost:5000/api/health

# Frontend
http://localhost:5173
```

---

*Document version 1.0 - Tests & Comptes Demo*
