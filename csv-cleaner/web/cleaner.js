const COLUMN_MAPPINGS = {
  Sources: ['source', 'URL', 'books', 'knowledges', 'societies', 'title', 'year'],
  Tiroirs: ['lesson', 'books', 'is_free', 'knowledges', 'sources', 'title'],
  Questions: ['question_id', 'books', 'categories', 'coefficient', 'collection', 'count_qrp', 'is_free', 'knowledge', 'lessons', 'similar', 'sources', 'specialty', 'type']
};

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"' && nextChar === '"' && insideQuotes) {
      currentCell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell);
        if (currentRow.some(cell => cell.trim())) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      }
    } else if (char !== '\r') {
      currentCell += char;
    }
  }
  
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    if (currentRow.some(cell => cell.trim())) {
      rows.push(currentRow);
    }
  }
  
  if (rows.length === 0) return { headers: [], rows: [] };
  
  const headers = rows[0].map(h => h.trim());
  const dataRows = rows.slice(1);
  
  return { headers, rows: dataRows };
}

function detectCSVType(headers) {
  const headerSet = new Set(headers.map(h => h.toLowerCase()));
  
  const sourcesMarkers = ['source', 'created by', 'created time', 'societies'];
  const tiroirsMarkers = ['lesson', 'annales', 'ccb asclepia', 'status'];
  const questionsMarkers = ['question_id', 'gdoc', 'item', 'lisa'];
  
  const sourcesScore = sourcesMarkers.filter(m => headerSet.has(m.toLowerCase())).length;
  const tiroirsScore = tiroirsMarkers.filter(m => headerSet.has(m.toLowerCase())).length;
  const questionsScore = questionsMarkers.filter(m => headerSet.has(m.toLowerCase())).length;
  
  if (sourcesScore >= 2) return 'Sources';
  if (tiroirsScore >= 2) return 'Tiroirs';
  if (questionsScore >= 2) return 'Questions';
  
  return null;
}

function removeURLsFromParentheses(text) {
  if (!text) return text;
  return text.replace(/\s*\(https?:\/\/[^\)]+\)/g, ' ');
}

function replaceCommasWithSemicolons(text) {
  if (!text) return text;
  text = text.replace(/\s+/g, ' ');
  text = text.replace(/\s*,\s*/g, ' ; ');
  return text.trim();
}

function cleanNumericValues(text) {
  if (!text) return text;
  text = text.replace(/\b1\.0\b/g, '1');
  text = text.replace(/\b2\.0\b/g, '2');
  text = text.replace(/\b0\.0\b/g, '0');
  return text;
}

function cleanCell(value, columnName, isURLColumn = false) {
  if (value === null || value === undefined) return '';
  
  let cleaned = value.trim();
  
  if (!cleaned) return '';
  
  if (!isURLColumn) {
    cleaned = removeURLsFromParentheses(cleaned);
  }
  
  cleaned = replaceCommasWithSemicolons(cleaned);
  cleaned = cleanNumericValues(cleaned);
  
  const columnsWithTrailingSpace = ['books', 'knowledges', 'title', 'knowledge', 'lessons', 'similar'];
  if (columnsWithTrailingSpace.includes(columnName.toLowerCase())) {
    cleaned = cleaned + ' ';
  }
  
  return cleaned;
}

function cleanCSV(csvText) {
  const { headers, rows } = parseCSV(csvText);
  
  if (headers.length === 0) {
    throw new Error('Le fichier CSV est vide ou mal formaté');
  }
  
  const type = detectCSVType(headers);
  
  if (!type) {
    throw new Error('Type de fichier non reconnu. Assurez-vous que c\'est un fichier Sources, Tiroirs ou Questions.');
  }
  
  const requiredColumns = COLUMN_MAPPINGS[type];
  
  const columnIndices = requiredColumns.map(col => {
    const index = headers.findIndex(h => h.toLowerCase() === col.toLowerCase());
    return { name: col, index };
  });
  
  const missingColumns = columnIndices.filter(c => c.index === -1);
  if (missingColumns.length > 0) {
    console.warn('Colonnes manquantes:', missingColumns.map(c => c.name));
  }
  
  const validColumnIndices = columnIndices.filter(c => c.index !== -1);
  
  if (validColumnIndices.length === 0) {
    throw new Error(`Aucune colonne correspondant au type ${type} n'a été trouvée`);
  }
  
  const cleanedHeaders = requiredColumns;
  
  const cleanedRows = rows.map(row => {
    return requiredColumns.map((colName) => {
      const colInfo = columnIndices.find(c => c.name === colName);
      if (!colInfo || colInfo.index === -1) {
        return '';
      }
      
      const value = row[colInfo.index] || '';
      const isURLColumn = colName.toLowerCase() === 'url';
      return cleanCell(value, colName, isURLColumn);
    });
  });
  
  const csvLines = [cleanedHeaders.join(',')];
  cleanedRows.forEach(row => {
    csvLines.push(row.join(','));
  });
  
  return {
    csv: csvLines.join('\n'),
    type,
    stats: {
      originalColumns: headers.length,
      cleanedColumns: cleanedHeaders.length,
      rows: cleanedRows.length,
      columnsKept: cleanedHeaders
    }
  };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { cleanCSV, detectCSVType, parseCSV };
}
