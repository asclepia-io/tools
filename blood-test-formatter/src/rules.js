/**
 * Règles de formatage et de sélection des analyses
 *
 * Ce fichier définit comment transformer les résultats bruts en format lisible.
 * Vous pouvez facilement adapter ces règles selon vos besoins.
 */

/**
 * Mapping des unités : convertit les unités techniques en format lisible
 */
export const unitMapping = {
  'x10*9/L': 'G/L',
  'x10*12/L': 'T/L',
  'g/dL': 'g/dL',
  'fL': 'fL',
  'pg': 'pg',
  '%': '%',
  'mmol/L': 'mmol/L',
  'µmol/L': 'µmol/L',
  'mg/L': 'mg/L',
  'ng/L': 'ng/L',
  'g/L': 'g/L',
  'U/L': 'UI/L',
  'UI/L': 'UI/L',
  'g/mol': 'g/mol',
  'g/mmol': 'g/mol',
  'mL/min/1.73m²': 'mL/min/1.73m²',
  'mm Hg': 'mmHg',
  'L/min': 'L/min'
};

/**
 * Mapping des noms d'analyses : normalise les noms pour l'affichage
 */
export const nameMapping = {
  'Leucocytes': 'Leucocytes',
  'Hémoglobine': 'Hb',
  'VGM': 'VGM',
  'Plaquettes': 'Plaquettes',
  'Polynucléaires neutrophiles': 'PNN',
  'Polynucléaires éosinophiles': 'PEo',
  'Polynucléaires basophiles': 'PBa',
  'Lymphocytes': 'Lymphocytes',
  'Monocytes': 'Monocytes',
  'Sodium': 'Na',
  'Potassium': 'K',
  'Chlorure': 'Cl',
  'Bicarbonate': 'Bicarbonate',
  'Urée': 'Urée',
  'Créatinine': 'Créatinine',
  'Créatininémie': 'Créatininémie',
  'CRP': 'CRP',
  'SAA': 'SAA',
  'Protéines': 'Protéines',
  'Hématies': 'Hématies',
  'Hématocrite': 'Hématocrite',
  'TCMH': 'TCMH',
  'CCMH': 'CCMH',
  'IDR': 'IDR',
  'VMP': 'VMP',
  'Réticulocytes': 'Réticulocytes',
  'Trou anionique': 'Trou anionique',
  'DFG calculé par MDRD': 'DFG',
  'DFG calculé par CKD-EPI': 'DFG',
  'Calcium': 'Ca',
  'Phosphates': 'Phosphates',
  'Magnésium': 'Magnésium',
  'ASAT': 'ASAT',
  'ALAT': 'ALAT',
  'GGT': 'GGT',
  'Gamma GT': 'GGT',
  'PAL': 'PAL',
  'Phosphatases alcalines': 'PAL',
  'Bilirubine': 'Bilirubine',
  'Bilirubine totale': 'Bilirubine',
  'Lipase': 'Lipase',
  'LDH': 'LDH',
  'Créatine kinase': 'CK',
  'BNP': 'BNP',
  'pH': 'pH',
  'pO2': 'PaO2',
  'pCO2': 'PaCO2',
  'Lactate': 'Lactate',
  'Débit O2': 'Débit O2',
  'HbA1c': 'HbA1c',
  'Hémoglobine A1c': 'HbA1c',
  'SAA': 'SAA',
  'Protéine sérique amyloide A': 'SAA',
  'Protéinurie/Créatininurie': 'Protéinurie/Créatininurie',
  'Protéines/Créatinine': 'Protéinurie/Créatininurie'
};

/**
 * Définit les catégories de sortie et quelles analyses inclure
 */
export const outputCategories = {
  // Chaque groupe représente un ensemble de valeurs séparées par une ligne vide
  groups: [
    {
      // Formule leucocytaire
      analyses: [
        { name: 'Leucocytes', unit: 'x10*9/L', required: false },
        { name: 'Polynucléaires neutrophiles', unit: 'x10*9/L', required: false },
        { name: 'Lymphocytes', unit: 'x10*9/L', required: false },
        { name: 'Polynucléaires éosinophiles', unit: 'x10*9/L', required: false }
      ]
    },
    {
      // Hémoglobine et indices érythrocytaires
      analyses: [
        { name: 'Hémoglobine', unit: 'g/dL', required: false },
        { name: 'VGM', unit: 'fL', required: false },
        { name: 'Hématocrite', unit: '%', required: false },
        { name: 'Réticulocytes', unit: 'x10*9/L', required: false }
      ]
    },
    {
      // Plaquettes
      analyses: [
        { name: 'Plaquettes', unit: 'x10*9/L', required: false }
      ]
    },
    {
      // Ionogramme
      analyses: [
        { name: 'Sodium', unit: 'mmol/L', required: false },
        { name: 'Potassium', unit: 'mmol/L', required: false },
        { name: 'Bicarbonate', unit: 'mmol/L', required: false },
        { name: 'Urée', unit: 'mmol/L', required: false },
        { name: 'Créatinine', unit: 'µmol/L', required: false },
        { name: 'Créatininémie', unit: 'mmol/L', required: false },
        { name: 'DFG calculé par CKD-EPI', unit: 'mL/min/1.73m²', required: false, special: 'dfg' }
      ]
    },
    {
      // Calcium, phosphates, magnésium
      analyses: [
        { name: 'Calcium', unit: 'mmol/L', required: false },
        { name: 'Phosphates', unit: 'mmol/L', required: false },
        { name: 'Magnésium', unit: 'mmol/L', required: false }
      ]
    },
    {
      // Enzymes hépatiques
      analyses: [
        { name: 'ASAT', unit: 'U/L', required: false },
        { name: 'ALAT', unit: 'U/L', required: false },
        { name: 'GGT', unit: 'U/L', required: false },
        { name: 'Gamma GT', unit: 'U/L', required: false },
        { name: 'PAL', unit: 'U/L', required: false },
        { name: 'Phosphatases alcalines', unit: 'U/L', required: false },
        { name: 'Bilirubine totale', unit: 'µmol/L', required: false },
        { name: 'Lipase', unit: 'U/L', required: false }
      ]
    },
    {
      // Protéines
      analyses: [
        { name: 'Protéines', unit: 'g/L', required: false },
        { name: 'Protéines', unit: 'mmol/L', required: false }
      ]
    },
    {
      // Inflammation
      analyses: [
        { name: 'CRP', unit: 'mg/L', required: false },
        { name: 'SAA', unit: 'mg/L', required: false },
        { name: 'Protéine sérique amyloide A', unit: 'mg/L', required: false }
      ]
    },
    {
      // Marqueurs cardiaques
      analyses: [
        { name: 'BNP', unit: 'ng/L', required: false }
      ]
    },
    {
      // Enzymes diverses
      analyses: [
        { name: 'LDH', unit: 'U/L', required: false },
        { name: 'Créatine kinase', unit: 'U/L', required: false }
      ]
    },
    {
      // Gaz du sang
      title: 'Gaz du sang sous O2',
      analyses: [
        { name: 'Débit O2', unit: 'L/min', required: false, special: 'gaz_debit' },
        { name: 'pH', unit: '', required: false },
        { name: 'pO2', unit: 'mm Hg', required: false },
        { name: 'pCO2', unit: 'mm Hg', required: false },
        { name: 'Lactate', unit: 'mmol/L', required: false }
      ]
    },
    {
      // HbA1c
      analyses: [
        { name: 'HbA1c', unit: '%', required: false },
        { name: 'Hémoglobine A1c', unit: '%', required: false }
      ]
    },
    {
      // Examens urinaires
      title: 'Examens urinaires',
      analyses: [
        { name: 'Sodium', unit: 'mmol/L', required: false, context: 'urine' },
        { name: 'Potassium', unit: 'mmol/L', required: false, context: 'urine' },
        { name: 'Chlorure', unit: 'mmol/L', required: false, context: 'urine' },
        { name: 'Protéinurie/Créatininurie', unit: 'g/mol', required: false },
        { name: 'Protéines/Créatinine', unit: 'g/mmol', required: false, special: 'convert_mmol_to_mol' }
      ]
    }
  ]
};

/**
 * Applique les règles pour sélectionner et filtrer les résultats
 */
export function applyRules(parsedData) {
  const dateGroups = {};

  // Grouper les sections par date
  for (const section of parsedData.sections) {
    const sectionDate = section.date;
    if (!sectionDate) continue;

    if (!dateGroups[sectionDate]) {
      dateGroups[sectionDate] = [];
    }
    dateGroups[sectionDate].push(section);
  }

  // Trier les dates par ordre chronologique
  const sortedDates = Object.keys(dateGroups).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split('/').map(Number);
    const [dayB, monthB, yearB] = b.split('/').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA - dateB;
  });

  // Créer la structure de sortie par date
  const outputByDate = [];

  for (const date of sortedDates) {
    const sectionsForDate = dateGroups[date];
    const groups = [];

    // Pour chaque groupe défini
    for (const groupConfig of outputCategories.groups) {
      const groupResults = {
        title: groupConfig.title || null,
        results: []
      };

      // Pour chaque analyse dans le groupe
      for (const analysisConfig of groupConfig.analyses) {
        // Chercher l'analyse dans les sections de cette date
        const found = findAnalysisInSections(
          sectionsForDate,
          parsedData.footnotes,
          analysisConfig.name,
          analysisConfig.unit,
          analysisConfig.context
        );

        if (found) {
          let value = found.value;
          let unit = unitMapping[found.unit] || found.unit;

          // Conversion spéciale pour g/mmol -> g/mol (multiplier par 1000)
          if (analysisConfig.special === 'convert_mmol_to_mol' && found.unit === 'g/mmol') {
            const numValue = parseFloat(value.replace(',', '.'));
            if (!isNaN(numValue)) {
              value = (numValue * 1000).toString();
            }
          }

          const result = {
            name: nameMapping[analysisConfig.name] || analysisConfig.name,
            value: value,
            unit: unit,
            abnormal: found.abnormal,
            special: analysisConfig.special === 'convert_mmol_to_mol' ? undefined : analysisConfig.special
          };
          groupResults.results.push(result);
        }
      }

      // Ajouter le groupe seulement s'il contient des résultats
      if (groupResults.results.length > 0) {
        groups.push(groupResults);
      }
    }

    // Ajouter cette date avec ses groupes
    if (groups.length > 0) {
      outputByDate.push({
        date: date,
        groups: groups
      });
    }
  }

  return {
    dates: sortedDates,
    dateGroups: outputByDate
  };
}

function findAnalysisInSections(sections, footnotes, name, unit, context) {
  let candidates = [];

  for (const section of sections) {
    for (const subsection of section.subsections) {
      // Filtrer par contexte en vérifiant à la fois la section et la sous-section
      const sectionName = section.name.toLowerCase();
      const subsectionName = subsection.name.toLowerCase();
      const isUrineSection = sectionName.includes('urinaire') || subsectionName.includes('urinaire');

      // Si on cherche des résultats urinaires et qu'on n'est pas dans une section urinaire, skip
      if (context === 'urine' && !isUrineSection) {
        continue;
      }
      // Si on ne cherche PAS des résultats urinaires et qu'on est dans une section urinaire, skip
      if (!context && isUrineSection) {
        continue;
      }

      for (const result of subsection.results) {
        const cleanName = result.name.replace(/…[¹²³⁴⁵⁶⁷⁸⁹]/g, '').trim();

        // Chercher par nom complet depuis les footnotes si applicable
        let fullName = cleanName;
        for (const [symbol, text] of Object.entries(footnotes)) {
          if (result.name.includes(symbol)) {
            fullName = text;
            break;
          }
        }

        // Vérifier si c'est l'analyse recherchée
        // Correspondance exacte
        if ((cleanName === name || fullName === name) && result.unit === unit) {
          return result;
        }

        // Correspondance partielle pour les unités (gérer mL/min/… qui devrait matcher mL/min/1.73m²)
        const unitsMatch = result.unit === unit ||
                          (unit === 'mL/min/1.73m²' && result.unit.startsWith('mL/min/'));

        // Correspondance partielle (pour les noms tronqués avec …)
        if (unitsMatch) {
          // Normaliser les noms pour la comparaison
          const normalizedResultName = cleanName.toLowerCase().replace(/\s+/g, ' ');
          const normalizedSearchName = name.toLowerCase().replace(/\s+/g, ' ');

          if (normalizedSearchName.startsWith(normalizedResultName) ||
              normalizedResultName.startsWith(normalizedSearchName.split(' ').slice(0, 2).join(' '))) {
            // Pour le DFG, on privilégie celui avec une note de bas de page (CKD-EPI)
            if (name.includes('DFG')) {
              const hasFootnote = result.name.match(/[¹²³⁴⁵⁶⁷⁸⁹]/);
              if (hasFootnote || fullName === name) {
                // Corriger l'unité si elle est tronquée
                if (result.unit.startsWith('mL/min/')) {
                  return { ...result, unit: 'mL/min/1.73m²' };
                }
                return result;
              }
              // Garder comme candidat
              candidates.push(result);
            } else {
              return result;
            }
          }
        }
      }
    }
  }

  // Si on a des candidats DFG mais pas trouvé celui avec note, retourner le premier
  if (candidates.length > 0) {
    const result = candidates[0];
    // Corriger l'unité si elle est tronquée
    if (result.unit.startsWith('mL/min/')) {
      return { ...result, unit: 'mL/min/1.73m²' };
    }
    return result;
  }

  return null;
}
