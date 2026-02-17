# Blood Test Formatter

Transforme des résultats de prise de sang bruts en texte formaté et lisible.

## Fonctionnalités

- Parse des résultats de laboratoire au format texte ASCII
- Système de règles adaptables et configurables
- Formatage intelligent des valeurs et unités
- Groupement par catégories
- Plusieurs formats de sortie (standard, détaillé, compact, JSON)
- Détection des valeurs anormales

## Installation

Aucune dépendance externe requise. Node.js 14+ suffit.

```bash
cd blood-test-formatter
```

## Utilisation

### Utilisation de base

```bash
# Format standard (défaut)
node src/index.js tests/test-data/sample-input.txt

# Format détaillé avec valeurs anormales marquées
node src/index.js -f detailed tests/test-data/sample-input.txt

# Format compact (une ligne par catégorie)
node src/index.js -f compact tests/test-data/sample-input.txt

# Format JSON pour traitement programmatique
node src/index.js -f json tests/test-data/sample-input.txt

# Mode verbose pour déboguer
node src/index.js -v tests/test-data/sample-input.txt
```

### Scripts NPM

```bash
# Lancer avec le fichier de test
npm test

# Avec vos propres données
npm start -- /chemin/vers/vos/resultats.txt
```

## Exemple de transformation

### Avant (format brut)
```
_______________________________________________________________________________________
 872600227994                ¦01/02/26                                    ¦Valeurs de
Analyse             ¦Unité   ¦05:30                                       ¦réf.
_______________________________________________________________________________________
HEMATOLOGIE - CYTOLOGIE
Numération
Leucocytes          ¦x10*9/L ¦8.37                                        ¦4-10
Hémoglobine         ¦g/dL    ¦12.6                                        ¦12-16
VGM                 ¦fL      ¦83.9                                        ¦80-100
Plaquettes          ¦x10*9/L ¦318                                         ¦150-400
...
```

### Après (format standard)
```
HÉMOGRAMME
Leucocytes 8,37 G/L  Hémoglobine 12,6 g/dL  VGM 83,9 fL  Plaquettes 318 G/L
Neutrophiles 5,8 G/L  Éosinophiles 0,15 G/L  Lymphocytes 1,66 G/L

BIOCHIMIE SANGUINE
Sodium 142 mM  Potassium 3,8 mM  Chlorure 102 mM  Bicarbonate 29 mM
Urée 8 mM  Créatinine 82 µM  CRP 23 mg/L  Protéines 65 g/L
```

### Après (format détaillé)
```
============================================================
HÉMOGRAMME
============================================================

Leucocytes                8,37 G/L
Hémoglobine               12,6 g/dL
VGM                       83,9 fL
Plaquettes                318 G/L
...
Urée                      8 mM ⚠️  ANORMAL
Créatinine                82 µM ⚠️  ANORMAL
```

## Configuration et personnalisation

Le système est conçu pour être facilement adaptable à vos besoins. Consultez le [GUIDE.md](GUIDE.md) pour apprendre à :

- Ajouter de nouvelles catégories d'analyses
- Modifier les noms et unités affichés
- Créer des profils personnalisés (minimal, complet, etc.)
- Organiser l'affichage selon vos préférences

### Fichier de règles

Les règles de formatage sont définies dans [src/rules.js](src/rules.js) et permettent de :
- Sélectionner les analyses à afficher
- Regrouper les analyses par catégories
- Normaliser les noms et unités
- Définir l'ordre d'affichage
- Marquer certaines analyses comme requises ou optionnelles

## Structure du projet

```
blood-test-formatter/
├── src/
│   ├── parser.js       # Extraction des données du format ASCII
│   ├── rules.js        # Configuration des règles de formatage
│   ├── formatter.js    # Génération du texte formaté
│   └── index.js        # Point d'entrée principal
├── tests/
│   └── test-data/
│       └── sample-input.txt  # Fichier de test
├── package.json
├── README.md           # Ce fichier
└── GUIDE.md           # Guide détaillé de personnalisation
```

## Aide

```bash
node src/index.js --help
```

## Limitations et notes

- Le parser est optimisé pour le format de résultats fourni en exemple
- Les résultats doivent utiliser le caractère `¦` comme séparateur
- Les notes de bas de page sont supportées (¹, ², ³, etc.)
- Le système recherche les analyses par nom et unité

## Évolutions possibles

- Support d'autres formats d'entrée (CSV, Excel, PDF)
- Génération de graphiques
- Comparaison avec des résultats précédents
- Export vers différents formats (HTML, PDF, etc.)
- Interface web ou GUI
