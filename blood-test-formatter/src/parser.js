/**
 * Parser pour extraire les données des résultats de prise de sang
 */

/**
 * Parse une ligne de résultat au format tabulaire
 * Format: "Nom ¦Unité ¦Valeur ¦Réf"
 */
function parseResultLine(line) {
  const parts = line.split('¦').map(p => p.trim());

  if (parts.length < 3) return null;

  const name = parts[0];
  const unit = parts[1] || '';
  const valueRaw = parts[2] || '';
  const refRange = parts[3] || '';

  // Ignorer les lignes vides ou non pertinentes
  if (!name || !valueRaw || valueRaw === 'PDF' || name.includes('___')) {
    return null;
  }

  // Détecter si la valeur est anormale (marquée avec +, -, etc.)
  const abnormal = valueRaw.includes('+') || valueRaw.includes('-');
  const value = valueRaw.replace(/[+\-\s]/g, '').trim();

  // Ignorer les lignes de texte descriptif
  // Accepter les valeurs qui commencent par un chiffre ou par < ou >
  if (isNaN(parseFloat(value)) && !value.match(/^[<>]?\d/)) {
    return null;
  }

  return {
    name,
    unit,
    value,
    refRange,
    abnormal
  };
}

/**
 * Détecte si une ligne est un titre de section
 */
function isSectionTitle(line) {
  const trimmed = line.trim();
  return trimmed.length > 0 &&
         !trimmed.includes('¦') &&
         !trimmed.startsWith('_') &&
         !trimmed.match(/^\s*\d/) &&
         trimmed === trimmed.toUpperCase() &&
         !trimmed.includes('Analyse');
}

/**
 * Détecte si une ligne est un titre de sous-section
 */
function isSubsectionTitle(line) {
  const trimmed = line.trim();
  return trimmed.length > 0 &&
         !trimmed.includes('¦') &&
         !trimmed.startsWith('_') &&
         !trimmed.match(/^\s*\d/) &&
         trimmed[0] === trimmed[0].toUpperCase() &&
         trimmed !== trimmed.toUpperCase() &&
         !trimmed.includes('Analyse');
}

/**
 * Détecte et extrait les notes de bas de page
 */
function parseFootnote(line) {
  const match = line.match(/^([¹²³⁴⁵⁶⁷⁸⁹])\s+(.+)$/);
  if (match) {
    return { symbol: match[1], text: match[2] };
  }
  return null;
}

/**
 * Extrait la date d'un en-tête de section
 * Format: " CODE                ¦DD/MM/YY                                    ¦Valeurs de"
 */
function parseDate(line) {
  const parts = line.split('¦');
  if (parts.length >= 2) {
    const dateStr = parts[1].trim();
    // Format: DD/MM/YY -> convertir en DD/MM/YYYY
    const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{2})/);
    if (match) {
      const day = match[1];
      const month = match[2];
      const year = '20' + match[3]; // Ajouter le siècle
      return `${day}/${month}/${year}`;
    }
  }
  return null;
}

/**
 * Parse le contenu complet du fichier
 */
export function parseBloodTest(content) {
  const lines = content.split('\n');
  const sections = [];
  const footnotes = {};
  let dates = [];

  let currentSection = null;
  let currentSubsection = null;
  let currentDate = null;

  for (const line of lines) {
    // Ignorer les lignes vides et les séparateurs
    if (!line.trim() || line.trim().startsWith('_')) {
      continue;
    }

    // Extraire la date si présente
    const date = parseDate(line);
    if (date) {
      currentDate = date;
      if (!dates.includes(date)) {
        dates.push(date);
      }
    }

    // Parser les notes de bas de page
    const footnote = parseFootnote(line);
    if (footnote) {
      footnotes[footnote.symbol] = footnote.text;
      continue;
    }

    // Détecter les sections principales
    if (isSectionTitle(line)) {
      currentSection = {
        name: line.trim(),
        subsections: [],
        date: currentDate
      };
      sections.push(currentSection);
      currentSubsection = null;
      continue;
    }

    // Détecter les sous-sections
    if (isSubsectionTitle(line) && currentSection) {
      currentSubsection = {
        name: line.trim(),
        results: []
      };
      currentSection.subsections.push(currentSubsection);
      continue;
    }

    // Parser les résultats
    if (line.includes('¦')) {
      const result = parseResultLine(line);
      if (result) {
        if (currentSubsection) {
          currentSubsection.results.push(result);
        } else if (currentSection) {
          // Si pas de sous-section, créer une sous-section par défaut
          if (currentSection.subsections.length === 0) {
            currentSection.subsections.push({
              name: '',
              results: []
            });
          }
          currentSection.subsections[currentSection.subsections.length - 1].results.push(result);
        }
      }
    }
  }

  return {
    dates,
    sections,
    footnotes
  };
}

/**
 * Nettoie et normalise un nom d'analyse (enlève les … et applique les notes)
 */
export function cleanAnalysisName(name, footnotes) {
  // Remplacer les … par le texte complet depuis les notes
  let cleaned = name;
  for (const [symbol, text] of Object.entries(footnotes)) {
    if (cleaned.includes(symbol)) {
      cleaned = text;
      break;
    }
  }

  // Enlever les … restants
  cleaned = cleaned.replace(/…/g, '');

  return cleaned.trim();
}
