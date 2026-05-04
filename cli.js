const fs = require('fs');

// PARADIGMA FUNCȚIONALĂ: Funcții pure, imuabilitate, chaining (map/filter/sort)
const readData = (filePath) => fs.readFileSync(filePath, 'utf-8');

const parseNames = (rawData) => rawData.split('\n').map(name => name.trim()).filter(Boolean);

const sortNames = (namesArray) => [...namesArray].sort((a, b) => a.localeCompare(b, 'ro', { sensitivity: 'base' }));

const formatOutput = (sortedNames) => 
  `Lista contine ${sortedNames.length} nume\n---------------------\n${sortedNames.join('\n')}`;

const writeOutput = (filePath, content) => fs.writeFileSync(filePath, content, 'utf-8');

// Compoziția funcțiilor (Pipe/Flow simplificat)
const processFile = (inputFile, outputFile) => {
  try {
    const result = formatOutput(sortNames(parseNames(readData(inputFile))));
    writeOutput(outputFile, result);
    console.log(`[Success] Lista a fost sortată și salvată în ${outputFile}`);
  } catch (error) {
    console.error('[Error] Procesarea a eșuat:', error.message);
  }
};

// Execuție
// Creează un fișier input.txt cu numele de test înainte să rulezi: node cli.js
processFile('./input.txt', './output.txt');