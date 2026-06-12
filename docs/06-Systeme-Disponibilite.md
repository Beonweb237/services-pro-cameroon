# Services Pro Cameroon - Systeme de Disponibilite

## Vue d'ensemble

Le systeme de disponibilite permet aux professionnels de gerer leur visibilite en temps reel aupres des clients. Il comprend trois mecanismes complementaires :

1. **Statut en temps reel** (available/busy/unavailable)
2. **Horaires hebdomadaires** (planification recurrente)
3. **Periodes d'indisponibilite** (conges, formations)

---

## 1. Statut en Temps Reel

### 1.1 Trois statuts possibles

| Statut | Label | Couleur | Description |
|--------|-------|---------|-------------|
| `available` | Disponible | Vert (#2ECC71) | Peut accepter des missions |
| `busy` | Occupe | Orange (#F5A623) | En mission en ce moment |
| `unavailable` | Indisponible | Rouge (#E74C3C) | Ne peut pas accepter de missions |

### 1.2 Stockage en BDD

```prisma
model ProProfile {
  availabilityStatus AvailabilityStatus @default(available)
  statusMessage      String?            @db.Text
  statusUntil        DateTime?
  // ...
}
```

### 1.3 Interface de changement (Dashboard Pro)

```
+------------------+
| Mon statut       |
| Changez votre    |
| visibilite       |
+------------------+
| [O] Disponible   |  <- Vert, selectionne par defaut
| Je peux accepter |
| des missions     |
+------------------+
| [ ] Occupe       |  <- Orange
| Je suis en       |
| mission en ce    |
| moment           |
+------------------+
| [ ] Indisponible |  <- Rouge
| Je ne peux pas   |
| accepter de      |
| missions         |
+------------------+
```

### 1.4 Impact sur la recherche

- Les pros avec statut `available` apparaissent prioritairement
- Le filtre `availability=now` ne retourne que les pros `available`
- Le statut est affiche sur la carte profil (point colore)

---

## 2. Horaires Hebdomadaires

### 2.1 Format de stockage (JSON)

```json
{
  "monday": [
    { "start": "08:00", "end": "12:00" },
    { "start": "14:00", "end": "18:00" }
  ],
  "tuesday": [
    { "start": "08:00", "end": "18:00" }
  ],
  "wednesday": [
    { "start": "08:00", "end": "18:00" }
  ],
  "thursday": [
    { "start": "08:00", "end": "18:00" }
  ],
  "friday": [
    { "start": "08:00", "end": "17:00" }
  ],
  "saturday": [
    { "start": "09:00", "end": "13:00" }
  ],
  "sunday": []
}
```

### 2.2 Interface de gestion (ProAvailability.tsx)

```
+-------------------------------+
| Horaires hebdomadaires        |
+-------------------------------+
| [Toggle] Lundi    08:00 - 18:00  [+] Creneau
| [Toggle] Mardi    08:00 - 18:00  [+] Creneau
| [Toggle] Mercredi 08:00 - 18:00  [+] Creneau
| [Toggle] Jeudi    08:00 - 18:00  [+] Creneau
| [Toggle] Vendredi 08:00 - 18:00  [+] Creneau
| [Toggle] Samedi   08:00 - 18:00  [+] Creneau
| [Toggle] Dimanche -- Indisponible --
+-------------------------------+
```

**Fonctionnalites :**
- Toggle par jour (active/desactive)
- Plusieurs creneaux par jour
- Suppression de creneau
- Enregistrement global

### 2.3 Logique d'affichage sur le profil

```typescript
function getCurrentAvailability(weeklySchedule: WeeklySchedule): string {
  const now = new Date();
  const dayName = now.toLocaleDateString('fr-FR', { weekday: 'lowercase' });
  const currentTime = `${now.getHours()}:${now.getMinutes()}`;
  
  const daySlots = weeklySchedule[dayName] || [];
  
  for (const slot of daySlots) {
    if (currentTime >= slot.start && currentTime <= slot.end) {
      return `Ouvert aujourd'hui jusqu'a ${slot.end}`;
    }
  }
  
  // Trouver le prochain jour ouvert
  const nextOpenDay = findNextOpenDay(weeklySchedule, dayName);
  return `Ferme - Prochainement ${nextOpenDay}`;
}
```

---

## 3. Periodes d'Indisponibilite

### 3.1 Modele de donnees

```prisma
model UnavailabilityPeriod {
  id          String   @id @default(cuid())
  proId       String
  pro         ProProfile @relation(fields: [proId], references: [id], onDelete: Cascade)
  startDate   DateTime
  endDate     DateTime
  reason      String?
  isRecurring Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@index([proId])
  @@index([startDate])
  @@map("unavailability_periods")
}
```

### 3.2 Interface de gestion

```
+----------------------------------+
| Periodes d'indisponibilite       |
+----------------------------------+
| 15/06/2026 -> 20/06/2026         |
| Conges                           |
|                       [Supprimer]|
+----------------------------------+
| 01/07/2026                       |
| Formation                        |
|                       [Supprimer]|
+----------------------------------+
| [+ Ajouter une periode]          |
+----------------------------------+
```

**Formulaire d'ajout :**
- Date de debut (date picker)
- Date de fin (date picker)
- Motif (texte optionnel) : "Conges", "Formation", "Maladie", "Autre"
- Checkbox "Recurrente" (annuel)

### 3.3 Periodes predefinies courantes

| Periode | Duree | Motif |
|---------|-------|-------|
| Vacances de fin d'annee | 2-3 semaines | Conges |
| Ramadan | 1 mois | Horaires modifies |
| Fetes nationales | 1-3 jours | Ferie |
| Formation continue | 1-5 jours | Formation |

---

## 4. Filtre de Disponibilite (Recherche)

### 4.1 Options de filtre

```
+------------------+
| Disponibilite    |
+------------------|
| [ ] Tous         |
| [ ] Maintenant   |  <- isAvailableNow = true
| [ ] Aujourd'hui  |  <- Horaire du jour actif
| [ ] Cette semaine|  <- Au moins 1 jour ouvert
+------------------+
```

### 4.2 Implementation du filtre backend

```typescript
// pro.routes.ts
if (availability === 'now') {
  where.availabilityStatus = 'available';
}
```

---

## 5. Affichage sur le Profil Public

### 5.1 Badge de disponibilite

```
+----------+
| [vert]   |  Disponible
+----------+

+----------+
| [orange] |  Occupe - Reponse sous 2h
+----------+

+----------+
| [rouge]  |  Indisponible jusqu'au 20/06
+----------+
```

### 5.2 Calendrier de disponibilite

Widget affichant les 7 prochains jours avec indication visuelle :
- Vert : Disponible (creneaux definis)
- Rouge : Indisponible (periode declaree)
- Gris : Ferme (aucun creneau)

---

## 6. Notifications liees

| Evenement | Notification envoyee a |
|-----------|----------------------|
| Pro passe a "occupe" | Clients avec mission en cours |
| Pro passe a "indisponible" | Clients favoris |
| Periode d'indisponibilite proche | Clients avec RDV dans la periode |
| Retour "disponible" | File d'attente de clients |

---

## 7. API Endpoints lies

### 7.1 Mettre a jour le statut

```
PUT /api/pros/:id/status
```

**Body :**
```json
{
  "availabilityStatus": "available",
  "statusMessage": "Disponible pour vos projets",
  "statusUntil": null
}
```

### 7.2 Mettre a jour les horaires hebdo

```
PUT /api/pros/:id/schedule
```

**Body :**
```json
{
  "weeklyAvailability": {
    "monday": [{ "start": "08:00", "end": "18:00" }],
    "tuesday": [{ "start": "08:00", "end": "18:00" }],
    "wednesday": [{ "start": "08:00", "end": "18:00" }],
    "thursday": [{ "start": "08:00", "end": "18:00" }],
    "friday": [{ "start": "08:00", "end": "17:00" }],
    "saturday": [{ "start": "09:00", "end": "13:00" }],
    "sunday": []
  }
}
```

### 7.3 Ajouter une periode d'indisponibilite

```
POST /api/pros/:id/unavailability
```

**Body :**
```json
{
  "startDate": "2026-06-15T00:00:00Z",
  "endDate": "2026-06-20T23:59:59Z",
  "reason": "Conges",
  "isRecurring": false
}
```

### 7.4 Supprimer une periode

```
DELETE /api/pros/:id/unavailability/:periodId
```

---

*Document version 1.0 - Systeme de Disponibilite*
