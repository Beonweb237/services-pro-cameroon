# Services Pro Cameroon - Algorithme Pro Score

## Vue d'ensemble

Le **Pro Score** est un systeme de notation pondere qui evalue la qualite d'un professionnel sur une echelle de 0 a 100. Il est base sur 5 criteres evalues par les clients, avec une ponderation temporelle qui privilegie les avis recents.

---

## 1. Formule de Calcul

### 1.1 Score brut d'un avis

```
Score_brut = (Q x 0.30) + (Po x 0.20) + (C x 0.20) + (V x 0.20) + (Pro x 0.10)
```

| Critere | Code | Poids | Description |
|---------|------|-------|-------------|
| Qualite | Q | 30% | Qualite du travail realise |
| Ponctualite | Po | 20% | Respect des horaires et delais |
| Communication | C | 20% | Clarte, reactivite, courtoisie |
| Valeur | V | 20% | Rapport qualite/prix |
| Professionnalisme | Pro | 10% | Comportement, presentation, expertise |

### 1.2 Ponderation temporelle

```
0 - 3 mois  : Poids = 1.0 (100%)
3 - 6 mois  : Poids = 0.8 (80%)
6 - 12 mois : Poids = 0.6 (60%)
12 - 24 mois: Poids = 0.4 (40%)
> 24 mois   : Poids = 0.2 (20%)
```

### 1.3 Score final (Pro Score)

```
Score_pondere = Σ(Score_brut_i x Poids_temporel_i) / Σ(Poids_temporel_i)
Pro Score     = round(Score_pondere x 20)  // Conversion /5 → /100
```

---

## 2. Implementation

### 2.1 Constantes

```typescript
// services/proScore.service.ts

const CRITERIA_WEIGHTS = {
  quality: 0.30,
  punctuality: 0.20,
  communication: 0.20,
  value: 0.20,
  professionalism: 0.10,
};

const getTemporalWeight = (reviewDate: Date): number => {
  const now = new Date();
  const monthsDiff = (now.getTime() - reviewDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsDiff <= 3) return 1.0;
  if (monthsDiff <= 6) return 0.8;
  if (monthsDiff <= 12) return 0.6;
  if (monthsDiff <= 24) return 0.4;
  return 0.2;
};
```

### 2.2 Fonction de calcul

```typescript
export const calculateProScore = async (proId: string): Promise<number> => {
  const reviews = await prisma.review.findMany({
    where: { proId, moderationStatus: 'approved' },
    select: {
      qualityScore: true,
      punctualityScore: true,
      communicationScore: true,
      valueScore: true,
      professionalismScore: true,
      createdAt: true,
    },
  });

  if (reviews.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (const review of reviews) {
    const temporalWeight = getTemporalWeight(review.createdAt);
    
    const rawScore =
      review.qualityScore * CRITERIA_WEIGHTS.quality +
      review.punctualityScore * CRITERIA_WEIGHTS.punctuality +
      review.communicationScore * CRITERIA_WEIGHTS.communication +
      review.valueScore * CRITERIA_WEIGHTS.value +
      review.professionalismScore * CRITERIA_WEIGHTS.professionalism;

    weightedSum += rawScore * temporalWeight;
    totalWeight += temporalWeight;
  }

  if (totalWeight === 0) return 0;

  const weightedAverage = weightedSum / totalWeight;
  const proScore = Math.round(weightedAverage * 20);

  return Math.min(100, Math.max(0, proScore));
};
```

---

## 3. Systeme de Niveaux (Levels)

### 3.1 Niveaux et conditions

| Niveau | Condition | Badge couleur |
|--------|-----------|---------------|
| **Starter** | Inscription + profil cree (defaut) | Gris |
| **Certified** | Identite verifiee + 3 avis approuves | Bronze |
| **Expert** | 20+ missions completees + Pro Score >= 84 | Argent |
| **Elite** | 100+ missions completees + Pro Score >= 94 | Or |
| **Partner** | Attribution manuelle par l'admin | Violet |

### 3.2 Fonction de verification des niveaux

```typescript
export const checkLevelEligibility = (
  currentLevel: string,
  proScore: number,
  completedMissions: number,
  approvedReviews: number,
  isIdentityVerified: boolean,
  complaintCount: number,
): { canLevelUp: boolean; nextLevel: string | null } => {
  switch (currentLevel) {
    case 'starter':
      if (isIdentityVerified && approvedReviews >= 3) {
        return { canLevelUp: true, nextLevel: 'certified' };
      }
      break;
    case 'certified':
      if (completedMissions >= 20 && proScore >= 84) {
        return { canLevelUp: true, nextLevel: 'expert' };
      }
      break;
    case 'expert':
      if (completedMissions >= 100 && proScore >= 94 && complaintCount === 0) {
        return { canLevelUp: true, nextLevel: 'elite' };
      }
      break;
    case 'elite':
      return { canLevelUp: false, nextLevel: 'partner' }; // Manuel
  }

  return { canLevelUp: false, nextLevel: null };
};
```

### 3.3 Mise a jour automatique

```typescript
export const updateProScoreAndLevel = async (proId: string): Promise<void> => {
  const proScore = await calculateProScore(proId);

  const pro = await prisma.proProfile.findUnique({
    where: { id: proId },
    include: {
      reviews: { where: { moderationStatus: 'approved' }, select: { overallScore: true } },
      _count: {
        select: { 
          reviews: { where: { moderationStatus: 'approved' } },
          missions: { where: { status: 'completed' } },
        },
      },
    },
  });

  const avgRating = pro.reviews.length > 0
    ? pro.reviews.reduce((sum, r) => sum + (r.overallScore || 0), 0) / pro.reviews.length
    : 0;

  // Determiner le nouveau niveau
  let newLevel = pro.level;
  if (completedMissions >= 100 && proScore >= 94 && pro.level !== 'partner') {
    newLevel = 'elite';
  } else if (completedMissions >= 20 && proScore >= 84 && pro.level !== 'elite' && pro.level !== 'partner') {
    newLevel = 'expert';
  } else if (pro.isIdentityVerified && approvedReviews >= 3 && pro.level === 'starter') {
    newLevel = 'certified';
  }

  await prisma.proProfile.update({
    where: { id: proId },
    data: {
      proScore,
      avgRating: Math.round(avgRating * 10) / 10,
      totalReviews: approvedReviews,
      totalMissions: completedMissions,
      level: newLevel,
    },
  });
};
```

---

## 4. Exemple de Calcul

### 4.1 Scenario

Un plombier a 4 avis sur 12 mois :

| # | Date | Q | Po | C | V | Pro |
|---|------|---|---|---|---|-----|
| 1 | Il y a 1 mois | 5 | 4 | 5 | 4 | 5 |
| 2 | Il y a 4 mois | 4 | 5 | 4 | 5 | 4 |
| 3 | Il y a 8 mois | 5 | 4 | 4 | 3 | 5 |
| 4 | Il y a 15 mois| 4 | 4 | 5 | 4 | 4 |

### 4.2 Etape 1 : Scores bruts

```
Avis 1 : (5x0.30) + (4x0.20) + (5x0.20) + (4x0.20) + (5x0.10) = 1.5 + 0.8 + 1.0 + 0.8 + 0.5 = 4.6
Avis 2 : (4x0.30) + (5x0.20) + (4x0.20) + (5x0.20) + (4x0.10) = 1.2 + 1.0 + 0.8 + 1.0 + 0.4 = 4.4
Avis 3 : (5x0.30) + (4x0.20) + (4x0.20) + (3x0.20) + (5x0.10) = 1.5 + 0.8 + 0.8 + 0.6 + 0.5 = 4.2
Avis 4 : (4x0.30) + (4x0.20) + (5x0.20) + (4x0.20) + (4x0.10) = 1.2 + 0.8 + 1.0 + 0.8 + 0.4 = 4.2
```

### 4.3 Etape 2 : Poids temporels

```
Avis 1 (1 mois)  : 1.0
Avis 2 (4 mois)  : 0.8
Avis 3 (8 mois)  : 0.6
Avis 4 (15 mois) : 0.4
```

### 4.4 Etape 3 : Score pondere

```
Numerateur   = (4.6 x 1.0) + (4.4 x 0.8) + (4.2 x 0.6) + (4.2 x 0.4)
             = 4.6 + 3.52 + 2.52 + 1.68
             = 12.32

Denominateur = 1.0 + 0.8 + 0.6 + 0.4 = 2.8

Score_pondere = 12.32 / 2.8 = 4.4
```

### 4.5 Etape 4 : Pro Score

```
Pro Score = round(4.4 x 20) = round(88) = 88
```

**Resultat :** Pro Score de **88/100** (niveau **Expert**)

---

## 5. Integration dans l'Application

### 5.1 Declenchement du recalcul

Le Pro Score est recalcule automatiquement lorsque :
- Un nouvel avis est soumis
- Un avis est modifie
- Un avis est supprime
- La moderation valide un avis

### 5.2 Affichage sur le profil

```
+------------------+
| Pro Score : 88   |
| ★★★★☆ 4.4/5     |
| (24 avis)        |
+------------------+
```

### 5.3 Affichage sur la carte de recherche

```
+------------------+
| Jean Kouam       |
| Plombier         |
|                  |
| Score: 88        |  <- Barre de progression doree
| ★★★★☆ 4.4        |
| [Expert]         |  <- Badge niveau
+------------------+
```

---

## 6. Gamification associee

### 6.1 Points gagnes

| Action | Points |
|--------|--------|
| Premiere mission | 50 |
| Mission completee | 20 |
| Avis 5 etoiles recu | 30 |
| Niveau up (Certified) | 100 |
| Niveau up (Expert) | 200 |
| Niveau up (Elite) | 500 |
| Reponse < 1h | 10 |
| Profil 100% complete | 50 |

---

*Document version 1.0 - Algorithme Pro Score*
