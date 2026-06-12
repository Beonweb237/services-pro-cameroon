# Services Pro Cameroon - Champs Specialises par Categorie

## Vue d'ensemble

Le systeme de champs specialises permet de configurer des champs additionnels specifiques a chaque categorie de metier. Par exemple, un couturier pourra ajouter des photos de ses vetements, un peintre des images de ses travaux, tandis qu'un medecin n'aura pas besoin de portfolio visuel.

---

## 1. Architecture

### 1.1 Modeles

```
Category (Plomberie)
  |
  +-- CategorySpecialField[] (Definitions des champs)
  |       +-- key: "certifications"
  |       +-- label: "Certifications"
  |       +-- type: "multiselect"
  |       +-- options: ["CAP Plomberie", "BTS Froid"]
  |
  +-- ProProfile[]
          |
          +-- ProSpecialFieldValue[] (Valeurs stockees)
                  +-- fieldId -> CategorySpecialField
                  +-- value: ["CAP Plomberie"]
```

### 1.2 Types de champs disponibles

| Type | Description | Exemple | UI |
|------|-------------|---------|-----|
| `text` | Texte court | Numero de licence | Input text |
| `textarea` | Texte long | Description de specialite | Textarea |
| `number` | Nombre | Annees d'experience supplementaires | Input number |
| `url` | Lien URL | Site web portfolio | Input URL |
| `image` | Image unique | Photo de certificat | Upload image |
| `image_gallery` | Galerie d'images | Photos de realisations | Upload multiple |
| `video_url` | Lien video | Video de presentation | Input URL + embed |
| `select` | Liste unique | Niveau d'etude | Select |
| `multiselect` | Selection multiple | Specialisations | Multi-select |
| `date` | Date | Date d'obtention diplome | Date picker |
| `boolean` | Oui/Non | Disponible pour urgences | Checkbox toggle |

---

## 2. Configuration par Categorie

### 2.1 Batiment

| Categorie | Champ | Type | Obligatoire |
|-----------|-------|------|-------------|
| **Plomberie** | certificat_raccordement | image | Non |
| | specialisations | multiselect | Non |
| | materiel_utilise | textarea | Non |
| **Electricite** | licence_electrique | image | Oui |
| | voltage_autorise | select | Oui |
| | normes_conformes | multiselect | Non |
| **Menuiserie** | galerie_realisations | image_gallery | Non |
| | type_bois_travailles | multiselect | Non |
| | outillage_specialise | textarea | Non |
| **Maconnerie** | galerie_chantiers | image_gallery | Non |
| | types_ouvrages | multiselect | Non |
| **Peinture** | galerie_avant_apres | image_gallery | Non |
| | types_peinture | multiselect | Non |
| | marques_utilisees | textarea | Non |

### 2.2 Numerique

| Categorie | Champ | Type | Obligatoire |
|-----------|-------|------|-------------|
| **Developpement Web** | portfolio_url | url | Non |
| | technologies | multiselect | Oui |
| | github_profile | url | Non |
| **Graphisme** | portfolio_visuel | image_gallery | Oui |
| | logiciels_maitrises | multiselect | Oui |
| | style_graphique | textarea | Non |
| **Marketing Digital** | certifications | multiselect | Non |
| | outils_utilises | multiselect | Oui |
| | etudes_de_cas | url | Non |

### 2.3 Sante

| Categorie | Champ | Type | Obligatoire |
|-----------|-------|------|-------------|
| **Medecin generaliste** | numero_ordre | text | Oui |
| | specialite_medicale | select | Oui |
| | diplomes | textarea | Oui |
| | prise_en_charge | multiselect | Non |
| **Infirmier(e)** | numero_ordre | text | Oui |
| | specialisations | multiselect | Non |
| | type_soins | multiselect | Oui |
| **Kinesitherapeute** | numero_adeli | text | Oui |
| | techniques | multiselect | Non |
| | appareillage | multiselect | Non |

### 2.4 Bien-etre

| Categorie | Champ | Type | Obligatoire |
|-----------|-------|------|-------------|
| **Coiffure** | galerie_coupes | image_gallery | Oui |
| | specialites | multiselect | Non |
| | produits_utilises | textarea | Non |
| | types_cheveux | multiselect | Non |
| **Maquillage** | galerie_looks | image_gallery | Oui |
| | specialites | multiselect | Non |
| | marques_preferrees | textarea | Non |
| **Massage** | certifications | image | Non |
| | types_massage | multiselect | Oui |
| | huiles_utilisees | textarea | Non |
| **Spa** | galerie_installations | image_gallery | Non |
| | soins_proposes | multiselect | Oui |
| | produits_bio | boolean | Non |

### 2.5 Education

| Categorie | Champ | Type | Obligatoire |
|-----------|-------|------|-------------|
| **Cours particuliers** | matieres | multiselect | Oui |
| | niveaux_enseignes | multiselect | Oui |
| | diplomes_pedagogiques | image | Non |
| **Coaching** | certifications | image | Non |
| | domaines | multiselect | Oui |
| | methode_approche | textarea | Non |
| **Formation pro** | domaines_formation | multiselect | Oui |
| | certifications_formateur | image | Oui |
| | experience_entreprises | textarea | Non |

### 2.6 Alimentation

| Categorie | Champ | Type | Obligatoire |
|-----------|-------|------|-------------|
| **Traiteur** | galerie_plats | image_gallery | Oui |
| | types_cuisine | multiselect | Oui |
| | nombre_couverts_max | number | Oui |
| | hygiene_certificat | image | Oui |
| **Patisserie** | galerie_gateaux | image_gallery | Oui |
| | specialites | multiselect | Non |
| | allergies_gerees | multiselect | Non |
| **Chef a domicile** | galerie_plats | image_gallery | Oui |
| | types_cuisine | multiselect | Oui |
| | experience_annees | number | Non |

### 2.7 Transport

| Categorie | Champ | Type | Obligatoire |
|-----------|-------|------|-------------|
| **Chauffeur** | permis_categories | multiselect | Oui |
| | type_vehicule | select | Oui |
| | experience_annees | number | Non |
| | langues_parlees | multiselect | Non |
| **Demenagement** | type_vehicules | multiselect | Oui |
| | surface_max | number | Non |
| | assurance_transport | boolean | Oui |
| **Livraison** | types_colis | multiselect | Oui |
| | zones_couvertes | multiselect | Oui |
| | mode_transport | select | Oui |

### 2.8 Mode

| Categorie | Champ | Type | Obligatoire |
|-----------|-------|------|-------------|
| **Couture** | galerie_vetements | image_gallery | Oui |
| | types_vetements | multiselect | Oui |
| | tissus_travailles | multiselect | Non |
| | sur_mesure | boolean | Non |
| **Styliste** | galerie_creations | image_gallery | Oui |
| | style_specialite | multiselect | Non |
| | collection_url | url | Non |

### 2.9 Animaux

| Categorie | Champ | Type | Obligatoire |
|-----------|-------|------|-------------|
| **Toilettage** | galerie_avant_apres | image_gallery | Oui |
| | especes_acceptees | multiselect | Oui |
| | produits_naturels | boolean | Non |
| **Pension** | galerie_installations | image_gallery | Oui |
| | especes_acceptees | multiselect | Oui |
| | superficie | number | Non |
| **Veterinaire** | numero_ordre | text | Oui |
| | specialites | multiselect | Non |
| | especes | multiselect | Oui |

### 2.10 Nettoyage

| Categorie | Champ | Type | Obligatoire |
|-----------|-------|------|-------------|
| **Menage** | types_prestations | multiselect | Oui |
| | produits_ecolabel | boolean | Non |
| | surface_max | number | Non |
| **Nettoyage vitres** | hauteur_max | number | Non |
| | equipement_special | textarea | Non |

---

## 3. API Endpoints

### 3.1 Gestion des definitions (Admin)

```
GET    /api/admin/special-fields           # Liste tous les champs
GET    /api/admin/special-fields/:categoryId # Champs d'une categorie
POST   /api/admin/special-fields           # Creer un champ
PUT    /api/admin/special-fields/:id       # Modifier
DELETE /api/admin/special-fields/:id       # Supprimer
```

**Body POST :**
```json
{
  "categoryId": "cuid-plomberie",
  "key": "certifications",
  "label": "Certifications",
  "type": "multiselect",
  "options": ["CAP Plomberie", "BTS Froid", "License Pro"],
  "required": true,
  "order": 1,
  "helpText": "Selectionnez vos certifications"
}
```

### 3.2 Gestion des valeurs (Pro)

```
GET    /api/pros/:id/special-values    # Valeurs du pro
POST   /api/pros/:id/special-values    # Ajouter/modifier une valeur
PUT    /api/pros/:id/special-values/:fieldId  # Modifier
DELETE /api/pros/:id/special-values/:fieldId  # Supprimer
```

**Body POST :**
```json
{
  "fieldId": "cuid-field",
  "value": ["CAP Plomberie", "BTS Froid"]
}
```

---

## 4. Integration Frontend

### 4.1 Affichage dans le profil pro (edition)

```
+--------------------------+
| Champs supplementaires   |
+--------------------------|
|                          |
| Certifications *         |
| [CAP Plomberie    ] [x]  |
| [BTS Froid        ] [x]  |
| [License Pro      ] [ ]  |
|                          |
| Materiel utilise         |
| [____________________]   |
|                          |
| Certificat               |
| [+ Ajouter une photo]    |
| [📷 certificat.jpg] [x]  |
+--------------------------+
```

### 4.2 Affichage sur le profil public

```
+--------------------------+
| Certifications           |
| - CAP Plomberie          |
| - BTS Froid              |
+--------------------------+
| Materiel                 |
| Pompe a chaleur,         |
| Chauffe-eau solaire      |
+--------------------------+
| [Voir certificat]        |
+--------------------------+
```

---

*Document version 1.0 - Champs Specialises*
