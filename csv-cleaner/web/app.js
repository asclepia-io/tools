let currentCSV = null;
let currentFileName = null;

const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');
const fileInfo = document.getElementById('fileInfo');
const typeDetected = document.getElementById('typeDetected');
const outputText = document.getElementById('outputText');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const stats = document.getElementById('stats');

uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFile(file);
  }
});

clearBtn.addEventListener('click', () => {
  resetUI();
});

downloadBtn.addEventListener('click', () => {
  if (currentCSV) {
    const blob = new Blob([currentCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFileName.replace('.csv', '_cleaned.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    downloadBtn.textContent = '✓ Téléchargé';
    downloadBtn.style.background = '#28a745';
    setTimeout(() => {
      downloadBtn.textContent = '📥 Télécharger';
      downloadBtn.style.background = '';
    }, 2000);
  }
});

function handleFile(file) {
  if (!file.name.endsWith('.csv')) {
    showError('Veuillez sélectionner un fichier CSV');
    return;
  }
  
  currentFileName = file.name;
  
  fileInfo.textContent = `📄 ${file.name} (${formatFileSize(file.size)})`;
  fileInfo.classList.add('visible');
  
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const result = cleanCSV(e.target.result);
      currentCSV = result.csv;
      
      typeDetected.textContent = `✓ Type détecté : ${result.type}`;
      typeDetected.classList.add('visible');
      typeDetected.classList.remove('error');
      
      displayResult(result.csv);
      displayStats(result.stats);
      
      downloadBtn.disabled = false;
      
    } catch (error) {
      showError(error.message);
    }
  };
  
  reader.onerror = () => {
    showError('Erreur lors de la lecture du fichier');
  };
  
  reader.readAsText(file);
}

function displayResult(csv) {
  const lines = csv.split('\n');
  const preview = lines.slice(0, 100).join('\n');
  const hasMore = lines.length > 100;
  
  outputText.textContent = preview + (hasMore ? '\n\n... (affichage limité aux 100 premières lignes)' : '');
  outputText.classList.add('has-content');
}

function displayStats(statsData) {
  stats.innerHTML = `
    <strong>Statistiques :</strong><br>
    Colonnes originales : ${statsData.originalColumns} → 
    Colonnes conservées : ${statsData.cleanedColumns}<br>
    Lignes traitées : ${statsData.rows}<br>
    Colonnes : ${statsData.columnsKept.join(', ')}
  `;
  stats.classList.add('visible');
}

function showError(message) {
  typeDetected.textContent = `✗ Erreur : ${message}`;
  typeDetected.classList.add('visible', 'error');
  
  outputText.innerHTML = `<p class="placeholder" style="color: #dc3545;">${message}</p>`;
  outputText.classList.remove('has-content');
  
  downloadBtn.disabled = true;
  currentCSV = null;
}

function resetUI() {
  fileInput.value = '';
  currentCSV = null;
  currentFileName = null;
  
  fileInfo.classList.remove('visible');
  typeDetected.classList.remove('visible', 'error');
  stats.classList.remove('visible');
  
  outputText.innerHTML = '<p class="placeholder">Le fichier nettoyé apparaîtra ici...</p>';
  outputText.classList.remove('has-content');
  
  downloadBtn.disabled = true;
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
