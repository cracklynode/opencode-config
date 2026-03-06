#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DOCUMENTS_DIR = process.argv[2] || './documents';
const OUTPUT_FILE = process.argv[3] || './documents-index.md';

const SUPPORTED_EXTENSIONS = {
  '.xlsx': 'Excel',
  '.xls': 'Excel',
  '.docx': 'Word',
  '.doc': 'Word',
  '.pptx': 'PowerPoint',
  '.ppt': 'PowerPoint',
  '.pdf': 'PDF',
  '.txt': 'Text',
  '.md': 'Markdown',
  '.csv': 'CSV'
};

async function parseDocument(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileName = path.basename(filePath);
  const docType = SUPPORTED_EXTENSIONS[ext];

  console.log('Parsing: ' + fileName + ' (' + docType + ')');

  try {
    let content = '';

    switch (ext) {
      case '.xlsx':
      case '.xls':
        content = await parseExcel(filePath);
        break;
      case '.docx':
      case '.doc':
        content = await parseWord(filePath);
        break;
      case '.pptx':
      case '.ppt':
        content = await parsePowerPoint(filePath);
        break;
      case '.pdf':
        content = await parsePdf(filePath);
        break;
      case '.txt':
      case '.md':
      case '.csv':
        content = fs.readFileSync(filePath, 'utf8');
        break;
      default:
        content = '[Unsupported file type]';
    }

    return {
      fileName: fileName,
      docType: docType,
      content: content.substring(0, 10000)
    };
  } catch (error) {
    return {
      fileName: fileName,
      docType: docType,
      content: '[Error parsing: ' + error.message + ']'
    };
  }
}

async function parseExcel(filePath) {
  try {
    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(filePath);
    let output = '';

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      
      output = output + '\n### Sheet: ' + sheetName + '\n\n';
      
      if (data.length > 0) {
        const maxRows = Math.min(data.length, 50);
        output = output + '| ' + data[0].join(' | ') + ' |\n';
        output = output + '| ' + data[0].map(function() { return '---'; }).join(' | ') + ' |\n';
        
        for (let i = 1; i < maxRows; i++) {
          output = output + '| ' + (data[i] || []).join(' | ') + ' |\n';
        }
        
        if (data.length > maxRows) {
          output = output + '\n*... ' + (data.length - maxRows) + ' more rows *\n';
        }
      }
    }

    return output || '[Empty spreadsheet]';
  } catch (e) {
    return '[Excel parsing error: ' + e.message + ']';
  }
}

async function parseWord(filePath) {
  try {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value || '[Empty document]';
  } catch (e) {
    return '[Word parsing error: ' + e.message + ']';
  }
}

async function parsePowerPoint(filePath) {
  try {
    const data = fs.readFileSync(filePath);
    return '[PowerPoint file detected: ' + filePath + ']\nNote: Full PPTX parsing requires additional libraries. Content summary needed.';
  } catch (e) {
    return '[PowerPoint parsing error: ' + e.message + ']';
  }
}

async function parsePdf(filePath) {
  try {
    const pdfParse = require('pdf-parse');
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text || '[Empty PDF]';
  } catch (e) {
    return '[PDF parsing error: ' + e.message + ']';
  }
}

async function main() {
  console.log('Scanning: ' + DOCUMENTS_DIR);
  
  if (!fs.existsSync(DOCUMENTS_DIR)) {
    console.error('Documents directory not found!');
    process.exit(1);
  }

  const files = fs.readdirSync(DOCUMENTS_DIR)
    .filter(function(f) { return SUPPORTED_EXTENSIONS[path.extname(f).toLowerCase()]; })
    .map(function(f) { return path.join(DOCUMENTS_DIR, f); });

  if (files.length === 0) {
    console.log('No supported documents found.');
    fs.writeFileSync(OUTPUT_FILE, '# Documents Index\n\nNo documents found.\n');
    return;
  }

  console.log('Found ' + files.length + ' document(s)');

  let indexContent = '# Documents Index\n\n';
  indexContent = indexContent + '*Generated: ' + new Date().toISOString() + '*\n\n';
  indexContent = indexContent + '*Source folder: ' + DOCUMENTS_DIR + '*\n\n---\n\n';

  for (const filePath of files) {
    const parsed = await parseDocument(filePath);
    
    indexContent = indexContent + '## ' + parsed.fileName + '\n\n';
    indexContent = indexContent + '**Type:** ' + parsed.docType + '\n\n';
    indexContent = indexContent + parsed.content + '\n\n';
    indexContent = indexContent + '---\n\n';
  }

  fs.writeFileSync(OUTPUT_FILE, indexContent);
  console.log('\nIndex created: ' + OUTPUT_FILE);
}

main().catch(console.error);
