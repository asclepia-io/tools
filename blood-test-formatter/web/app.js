/**
 * Application principale - Gestion de l'interface utilisateur
 */

(function () {
  // Éléments DOM
  const inputText = document.getElementById('inputText');
  const outputText = document.getElementById('outputText');
  const copyBtn = document.getElementById('copyBtn');
  const clearBtn = document.getElementById('clearBtn');
  const includeAllCheckbox = document.getElementById('includeAll');
  const formatSelect = document.getElementById('formatSelect');
  const showRulesBtn = document.getElementById('showRulesBtn');
  const rulesModal = document.getElementById('rulesModal');
  const closeModal = document.querySelector('.close');

  // État de l'application
  let currentParsedData = null;
  let currentFilteredData = null;

  /**
   * Traite l'input et génère l'output
   */
  function processInput() {
    const input = inputText.value.trim();

    if (!input) {
      outputText.innerHTML =
        '<p class="placeholder">Les résultats formatés apparaîtront ici...</p>';
      outputText.classList.remove('has-content', 'error');
      return;
    }

    try {
      // Parser les données
      currentParsedData = BloodTestParser.parseBloodTest(input);

      // Appliquer les règles
      const includeAll = includeAllCheckbox.checked;
      currentFilteredData = BloodTestRules.applyRules(
        currentParsedData,
        includeAll,
      );

      // Formater selon le format sélectionné
      const format = formatSelect.value;
      let output;

      switch (format) {
        case 'detailed':
          output = BloodTestFormatter.formatDetailedOutput(currentFilteredData);
          break;
        case 'compact':
          output = BloodTestFormatter.formatCompactOutput(currentFilteredData);
          break;
        case 'standard':
        default:
          output = BloodTestFormatter.formatOutput(currentFilteredData);
          break;
      }

      // Afficher le résultat
      outputText.textContent = output;
      outputText.classList.add('has-content');
      outputText.classList.remove('error');
    } catch (error) {
      console.error('Erreur lors du traitement:', error);
      outputText.textContent = `❌ Erreur lors du traitement des données:\n\n${error.message}\n\nVérifiez que le format d'entrée est correct.`;
      outputText.classList.add('error');
      outputText.classList.remove('has-content');
    }
  }

  /**
   * Copie le contenu de l'output dans le presse-papier
   */
  function copyOutput() {
    const text = outputText.textContent;

    if (!text || text.includes('apparaîtront ici') || text.includes('Erreur')) {
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Feedback visuel
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copié !';
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('copied');
        }, 2000);
      })
      .catch((err) => {
        console.error('Erreur lors de la copie:', err);
        alert('Erreur lors de la copie dans le presse-papier');
      });
  }

  /**
   * Efface l'input
   */
  function clearInput() {
    inputText.value = '';
    outputText.innerHTML =
      '<p class="placeholder">Les résultats formatés apparaîtront ici...</p>';
    outputText.classList.remove('has-content', 'error');
    currentParsedData = null;
    currentFilteredData = null;
  }

  /**
   * Affiche les règles de formatage
   */
  function showRules() {
    console.log('showRules');
    const rulesContent = document.getElementById('rulesContent');
    const rules = BloodTestRules.outputCategories;

    let html = '<h3>Catégories configurées</h3>';

    for (let i = 0; i < rules.groups.length; i++) {
      const group = rules.groups[i];

      if (group.title) {
        html += `<h4>${group.title}</h4>`;
      }

      html += `<p><strong>Groupe ${i + 1}:</strong></p><ul>`;

      for (const analysis of group.analyses) {
        const required = analysis.required ? '(requis)' : '(optionnel)';
        html += `<li>${analysis.name} [${analysis.unit}] ${required}</li>`;
      }

      html += '</ul>';
    }

    html += "<h3>Mappings d'unités</h3><ul>";
    for (const [from, to] of Object.entries(BloodTestRules.unitMapping)) {
      html += `<li>${from} → ${to}</li>`;
    }
    html += '</ul>';

    rulesContent.innerHTML = html;
    rulesModal.style.display = 'block';
  }

  /**
   * Ferme le modal
   */
  function hideRules() {
    rulesModal.style.display = 'none';
  }

  // Événements
  inputText.addEventListener('input', processInput);
  includeAllCheckbox.addEventListener('change', processInput);
  formatSelect.addEventListener('change', processInput);
  copyBtn.addEventListener('click', copyOutput);
  clearBtn.addEventListener('click', clearInput);
  showRulesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('showRules');
    showRules();
  });
  closeModal.addEventListener('click', hideRules);

  // Fermer le modal en cliquant en dehors
  window.addEventListener('click', (e) => {
    if (e.target === rulesModal) {
      hideRules();
    }
  });

  // Charger des données de test au démarrage (optionnel)
  window.addEventListener('load', () => {
    console.log('Blood Test Formatter v1.0 chargé');
  });

  // Gestion du drag & drop de fichiers (bonus)
  inputText.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputText.style.borderColor = '#667eea';
  });

  inputText.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputText.style.borderColor = '#dee2e6';
  });

  inputText.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    inputText.style.borderColor = '#dee2e6';

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        inputText.value = event.target.result;
        processInput();
      };

      reader.readAsText(file);
    }
  });
})();

