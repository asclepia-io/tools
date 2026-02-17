/**
 * Formatteur pour générer le texte de sortie
 */

/**
 * Formate une valeur avec son unité
 */
function formatValue(result) {
  const value = result.value.replace(',', '.');

  // Gestion des nombres décimaux
  const numValue = parseFloat(value);
  let displayValue = value;

  // Si c'est un nombre, on peut le formater
  if (!isNaN(numValue)) {
    // Utiliser le point comme séparateur décimal
    displayValue = numValue.toString();
  }

  // Gestion spéciale pour le DFG
  if (result.special === 'dfg') {
    return `${displayValue} ${result.unit} (CKD-EPI)`;
  }

  // Gestion spéciale pour le débit O2 (ne pas afficher sur une ligne séparée)
  if (result.special === 'gaz_debit') {
    return null;
  }

  // Pas d'espace avant le %
  if (result.unit === '%') {
    return `${displayValue}%`;
  }

  // Pas d'unité pour le pH
  if (result.name === 'pH') {
    return displayValue;
  }

  return `${displayValue} ${result.unit}`;
}

/**
 * Formate un résultat individuel sur une ligne
 */
function formatResult(result) {
  const formattedValue = formatValue(result);
  if (formattedValue === null) {
    return null;
  }
  return `${result.name} ${formattedValue}`;
}

/**
 * Formate les données selon le format de sortie souhaité
 */
export function formatOutput(filteredData) {
  const lines = [];

  // Vérifier si on a des dateGroups (nouvelle structure) ou groups (ancienne structure)
  if (filteredData.dateGroups && filteredData.dateGroups.length > 0) {
    // Nouvelle structure avec dates
    for (const dateGroup of filteredData.dateGroups) {
      // Afficher la date
      lines.push(dateGroup.date);
      lines.push('');

      // Afficher chaque groupe pour cette date
      for (const group of dateGroup.groups) {
        // Gérer le titre spécial pour les gaz du sang
        let groupTitle = group.title;
        let debitO2 = null;
        
        if (group.title && group.title.includes('Gaz du sang')) {
          const debitResult = group.results.find(r => r.special === 'gaz_debit');
          if (debitResult) {
            debitO2 = debitResult.value;
          }
        }

        // Afficher le titre du groupe s'il existe
        if (groupTitle) {
          if (debitO2) {
            lines.push(`${groupTitle} ${debitO2} L/min`);
          } else {
            lines.push(groupTitle);
          }
        }

        // Afficher chaque résultat sur une ligne séparée
        for (const result of group.results) {
          const formattedLine = formatResult(result);
          if (formattedLine) {
            lines.push(formattedLine);
          }
        }

        // Ligne vide après chaque groupe
        lines.push('');
      }
    }
  } else if (filteredData.groups && filteredData.groups.length > 0) {
    // Ancienne structure sans dates (rétrocompatibilité)
    // Afficher les dates en premier
    if (filteredData.dates && filteredData.dates.length > 0) {
      for (const date of filteredData.dates) {
        lines.push(date);
        lines.push('');
      }
    }

    // Afficher chaque groupe
    for (const group of filteredData.groups) {
      // Afficher le titre du groupe s'il existe
      if (group.title) {
        lines.push(group.title);
      }

      // Afficher chaque résultat sur une ligne séparée
      for (const result of group.results) {
        lines.push(formatResult(result));
      }

      // Ligne vide après chaque groupe
      lines.push('');
    }
  }

  // Enlever la dernière ligne vide
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  return lines.join('\n');
}

/**
 * Génère un rapport détaillé avec les valeurs anormales en évidence
 */
export function formatDetailedOutput(filteredData) {
  const lines = [];

  // Afficher les dates
  if (filteredData.dates && filteredData.dates.length > 0) {
    lines.push('='.repeat(60));
    lines.push('DATES');
    lines.push('='.repeat(60));
    for (const date of filteredData.dates) {
      lines.push(date);
    }
    lines.push('');
  }

  // Afficher chaque groupe
  for (const group of filteredData.groups) {
    if (group.title) {
      lines.push('='.repeat(60));
      lines.push(group.title);
      lines.push('='.repeat(60));
      lines.push('');
    }

    for (const result of group.results) {
      let line = `${result.name.padEnd(25)} ${formatValue(result)}`;

      if (result.abnormal) {
        line += ' ⚠️  ANORMAL';
      }

      lines.push(line);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Génère un résumé compact (une ligne par groupe)
 */
export function formatCompactOutput(filteredData) {
  const lines = [];

  // Afficher les dates
  if (filteredData.dates && filteredData.dates.length > 0) {
    lines.push(`Dates: ${filteredData.dates.join(', ')}`);
  }

  // Afficher chaque groupe
  for (const group of filteredData.groups) {
    const allItems = [];

    for (const result of group.results) {
      allItems.push(`${result.name} ${formatValue(result)}`);
    }

    if (allItems.length > 0) {
      const prefix = group.title ? `${group.title}: ` : '';
      lines.push(`${prefix}${allItems.join(', ')}`);
    }
  }

  return lines.join('\n');
}

/**
 * Génère un rapport JSON structuré
 */
export function formatJsonOutput(filteredData) {
  return JSON.stringify(filteredData, null, 2);
}
