#!/usr/bin/env node

/**
 * Blood Test Formatter - Point d'entrée principal
 */

import { readFileSync } from 'fs';
import { parseBloodTest } from './parser.js';
import { applyRules } from './rules.js';
import { formatOutput, formatDetailedOutput, formatCompactOutput, formatJsonOutput } from './formatter.js';

/**
 * Affiche l'aide
 */
function showHelp() {
  console.log(`
Blood Test Formatter - Transforme des résultats de prise de sang en texte formaté

Usage:
  node src/index.js [options] <fichier>

Options:
  -h, --help        Affiche cette aide
  -f, --format      Format de sortie: standard (défaut), detailed, compact, json
  -v, --verbose     Mode verbeux (affiche les données parsées)

Exemples:
  node src/index.js tests/test-data/sample-input.txt
  node src/index.js -f detailed tests/test-data/sample-input.txt
  node src/index.js -f compact tests/test-data/sample-input.txt
  node src/index.js -f json tests/test-data/sample-input.txt
  `);
}

/**
 * Parse les arguments de ligne de commande
 */
function parseArgs(args) {
  const config = {
    format: 'standard',
    verbose: false,
    file: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      showHelp();
      process.exit(0);
    } else if (arg === '-f' || arg === '--format') {
      config.format = args[++i];
    } else if (arg === '-v' || arg === '--verbose') {
      config.verbose = true;
    } else if (!arg.startsWith('-')) {
      config.file = arg;
    }
  }

  return config;
}

/**
 * Fonction principale
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ Erreur: Aucun fichier spécifié\n');
    showHelp();
    process.exit(1);
  }

  const config = parseArgs(args);

  if (!config.file) {
    console.error('❌ Erreur: Aucun fichier spécifié\n');
    showHelp();
    process.exit(1);
  }

  try {
    // Lire le fichier
    const content = readFileSync(config.file, 'utf-8');

    // Parser les données
    const parsedData = parseBloodTest(content);

    if (config.verbose) {
      console.log('=== DONNÉES PARSÉES ===');
      console.log(JSON.stringify(parsedData, null, 2));
      console.log('\n=== NOTES DE BAS DE PAGE ===');
      console.log(parsedData.footnotes);
      console.log('\n');
    }

    // Appliquer les règles
    const filteredData = applyRules(parsedData);

    if (config.verbose) {
      console.log('=== DONNÉES FILTRÉES ===');
      console.log(JSON.stringify(filteredData, null, 2));
      console.log('\n');
    }

    // Générer le format de sortie
    let output;
    switch (config.format) {
      case 'detailed':
        output = formatDetailedOutput(filteredData);
        break;
      case 'compact':
        output = formatCompactOutput(filteredData);
        break;
      case 'json':
        output = formatJsonOutput(filteredData);
        break;
      case 'standard':
      default:
        output = formatOutput(filteredData);
        break;
    }

    // Afficher le résultat
    console.log(output);

  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    if (config.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Exécuter si appelé directement
// Dans un module ES, on vérifie si c'est le module principal
import { fileURLToPath } from 'url';
const isMainModule = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMainModule) {
  main();
}

export { main };
