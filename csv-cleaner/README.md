# CSV Cleaner

Outil de nettoyage automatique de fichiers CSV pour les types Sources, Tiroirs et Questions.

## Fonctionnalités

- Détection automatique du type de fichier (Sources, Tiroirs, Questions)
- Suppression des colonnes inutiles
- Nettoyage automatique des données :
  - Remplacement des virgules par des points-virgules
  - Suppression des URLs entre parenthèses (sauf colonne URL)
  - Nettoyage des valeurs numériques (1.0 → 1, 2.0 → 2, 0.0 → 0)
- Interface web intuitive avec glisser-déposer
- Téléchargement du fichier nettoyé

## Types de fichiers supportés

### Sources

Colonnes conservées : `source, URL, books, knowledges, societies, title, year`

### Tiroirs

Colonnes conservées : `lesson, books, is_free, knowledges, sources, title`

### Questions

Colonnes conservées : `question_id, books, categories, coefficient, collection, count_qrp, is_free, knowledge, lessons, similar, sources, specialty, type`

## Utilisation

1. Ouvrez `web/index.html` dans un navigateur
2. Glissez-déposez votre fichier CSV ou cliquez pour le sélectionner
3. Le type est détecté automatiquement
4. Le fichier est nettoyé et affiché
5. Cliquez sur "Télécharger" pour sauvegarder le résultat

## Règles de transformation

### Pour toutes les colonnes (sauf URL) :

- Les URLs entre parenthèses sont supprimées : `HGE (https://...)` → `HGE`
- Les virgules sont remplacées par des points-virgules : `a, b, c` → `a; b; c`
- Les valeurs numériques sont nettoyées : `1.0` → `1`, `2.0` → `2`, `0.0` → `0`

### Pour la colonne URL :

- Les URLs sont conservées telles quelles
- Seules les virgules et valeurs numériques sont nettoyées

## Structure du projet

```
csv-cleaner/
├── web/
│   ├── index.html      # Interface web
│   ├── styles.css      # Styles CSS
│   ├── cleaner.js      # Logique de nettoyage
│   └── app.js          # Gestion de l'interface
├── exemples/           # Exemples de fichiers avant/après
│   ├── Sources avant.csv
│   ├── Sources après.csv
│   ├── Tiroirs avant.csv
│   ├── Tiroirs après.csv
│   ├── Questions avant.csv
│   └── Questions après.csv
└── README.md           # Ce fichier
```

## Navigation

L'outil fait partie de la suite Asclepia Tools et dispose d'une navbar pour naviguer entre :

- **Better Labs Results** - Formattage des résultats de prise de sang
- **CSV Cleaner** - Nettoyage de fichiers CSV

## Développement

Aucune dépendance externe requise. Le projet utilise du JavaScript vanilla et fonctionne directement dans le navigateur.

## Exemples

Les dossiers `exemples/` contiennent des fichiers avant/après pour chaque type, permettant de valider le bon fonctionnement des transformations.
