# Guide d'adaptation des règles

Ce guide explique comment personnaliser le système de règles pour adapter le formatage des résultats à vos besoins.

## Structure du fichier de règles

Le fichier [src/rules.js](src/rules.js) contient trois sections principales :

### 1. Mapping des unités (`unitMapping`)

Convertit les unités techniques en format lisible :

```javascript
export const unitMapping = {
  'x10*9/L': 'G/L',      // Giga par litre
  'x10*12/L': 'T/L',     // Tera par litre
  'g/dL': 'g/dL',        // Grammes par décilitre
  'mmol/L': 'mM',        // Millimolaire
  // ... ajoutez vos propres mappings
};
```

**Comment adapter :**
- Ajoutez de nouvelles lignes pour convertir d'autres unités
- Modifiez les conversions existantes selon votre préférence

### 2. Mapping des noms (`nameMapping`)

Normalise les noms d'analyses pour l'affichage :

```javascript
export const nameMapping = {
  'Leucocytes': 'Leucocytes',
  'Polynucléaires neutrophiles': 'Neutrophiles',
  'Hémoglobine': 'Hémoglobine',
  // ... personnalisez les noms affichés
};
```

**Comment adapter :**
- Utilisez des noms plus courts ou plus longs selon votre préférence
- Traduisez dans une autre langue si nécessaire
- Uniformisez les terminologies selon votre convention

### 3. Catégories de sortie (`outputCategories`)

Définit quelles analyses afficher et comment les organiser :

```javascript
export const outputCategories = {
  'HÉMOGRAMME': {
    title: 'HÉMOGRAMME',
    groups: [
      {
        analyses: [
          { name: 'Leucocytes', unit: 'x10*9/L', required: true },
          { name: 'Hémoglobine', unit: 'g/dL', required: true },
          // ... autres analyses
        ]
      }
    ]
  }
};
```

**Structure :**
- **Catégorie** : Groupe principal (ex: HÉMOGRAMME, BIOCHIMIE)
- **Groups** : Sous-groupes qui apparaissent sur des lignes séparées
- **Analyses** : Liste des analyses à inclure dans chaque groupe

**Paramètres d'une analyse :**
- `name` : Nom exact tel qu'il apparaît dans les résultats bruts
- `unit` : Unité exacte telle qu'elle apparaît dans les résultats bruts
- `required` :
  - `true` = toujours afficher (même si manquant, affichera "N/A")
  - `false` = afficher uniquement si présent dans les résultats

## Exemples de personnalisation

### Exemple 1 : Ajouter une nouvelle catégorie

```javascript
'FONCTION HÉPATIQUE': {
  title: 'FONCTION HÉPATIQUE',
  groups: [
    {
      analyses: [
        { name: 'ALAT', unit: 'U/L', required: true },
        { name: 'ASAT', unit: 'U/L', required: true },
        { name: 'Bilirubine totale', unit: 'µmol/L', required: false }
      ]
    }
  ]
}
```

### Exemple 2 : Modifier l'organisation des groupes

Pour afficher moins d'analyses par ligne, créez plus de groupes :

```javascript
'HÉMOGRAMME': {
  title: 'HÉMOGRAMME',
  groups: [
    {
      // Ligne 1 : Numération de base
      analyses: [
        { name: 'Leucocytes', unit: 'x10*9/L', required: true },
        { name: 'Hémoglobine', unit: 'g/dL', required: true }
      ]
    },
    {
      // Ligne 2 : Indices érythrocytaires
      analyses: [
        { name: 'VGM', unit: 'fL', required: true },
        { name: 'TCMH', unit: 'pg', required: false }
      ]
    }
  ]
}
```

### Exemple 3 : Créer un profil minimal

Pour afficher uniquement les valeurs essentielles :

```javascript
export const outputCategories = {
  'RÉSULTATS ESSENTIELS': {
    title: 'RÉSULTATS ESSENTIELS',
    groups: [
      {
        analyses: [
          { name: 'Leucocytes', unit: 'x10*9/L', required: true },
          { name: 'Hémoglobine', unit: 'g/dL', required: true },
          { name: 'Plaquettes', unit: 'x10*9/L', required: true },
          { name: 'CRP', unit: 'mg/L', required: true }
        ]
      }
    ]
  }
};
```

### Exemple 4 : Ajouter des noms d'analyses avec variantes

Si une même analyse peut avoir plusieurs noms dans les résultats :

```javascript
// Dans nameMapping, normalisez les variantes
export const nameMapping = {
  'Glucose': 'Glycémie',
  'Glucose à jeun': 'Glycémie',
  'Glycémie': 'Glycémie',
  // Tous ces noms seront affichés comme "Glycémie"
};
```

## Formats de sortie disponibles

Le système propose 4 formats :

1. **standard** (défaut) : Format condensé, groupé par catégories
2. **detailed** : Format détaillé avec alignement et marqueurs pour valeurs anormales
3. **compact** : Une ligne par catégorie
4. **json** : Format JSON structuré pour traitement programmatique

Utilisation :
```bash
node src/index.js -f standard fichier.txt
node src/index.js -f detailed fichier.txt
node src/index.js -f compact fichier.txt
node src/index.js -f json fichier.txt
```

## Conseils pratiques

1. **Testez vos modifications** : Après chaque modification, testez avec votre fichier de données
2. **Gardez une sauvegarde** : Copiez le fichier rules.js original avant de le modifier
3. **Commencez petit** : Modifiez une section à la fois et testez
4. **Utilisez le mode verbose** : `node src/index.js -v fichier.txt` pour déboguer
5. **Vérifiez les noms exacts** : Les noms et unités doivent correspondre exactement à ceux du fichier source

## Résolution de problèmes

**Problème** : Une analyse n'apparaît pas dans le résultat
- Vérifiez que le nom et l'unité correspondent exactement aux données brutes
- Utilisez le mode verbose pour voir comment les données sont parsées
- Vérifiez que l'analyse est dans une catégorie de `outputCategories`

**Problème** : Les unités ne sont pas converties
- Vérifiez que l'unité exacte est dans `unitMapping`
- Respectez la casse et les espaces

**Problème** : Les valeurs sont marquées "N/A"
- L'analyse est marquée `required: true` mais absente des données
- Soit changez `required: false`, soit vérifiez que les données la contiennent
