/**
 * sort.test.js — Teste Jest pentru Proiect 4: Sortarea Numelor
 * Rulare: npm test (necesită Node.js + Jest instalat)
 *
 * Instalare: npm install --save-dev jest
 * Package.json scripts: { "test": "jest" }
 */

'use strict';

/* ============================================================
   Funcții pure testate izolat (fără import UI)
   ============================================================ */

/** Sortare alfabetică ASC cu localeCompare */
const sortAsc = (arr) =>
  [...arr].sort((a, b) => a.localeCompare(b, 'ro', { sensitivity: 'base' }));

/** Sortare alfabetică DESC */
const sortDesc = (arr) =>
  [...arr].sort((a, b) => b.localeCompare(a, 'ro', { sensitivity: 'base' }));

/** Validare: un nume valid nu este șir gol sau doar spații */
const validateName = (name) => name.trim().length > 0;

/** Numărul de elemente nu este hardcodat */
const countNames = (arr) => arr.length;

/** Eliminare duplicate */
const removeDuplicates = (arr) => [...new Set(arr.map(n => n.trim()))];

/** Generare text output (format cerut) */
const generateOutput = (names) => {
  const count = names.length;
  const sep   = '_'.repeat(Math.max(22, count * 2));
  return `Lista contine ${count} nume\n${sep}\n\n${names.join('\n')}`;
};

/* ============================================================
   Date de test
   ============================================================ */
const SAMPLE_NAMES = [
  'Ling, Mai',
  'Johnson, Jim',
  'Zarnecki, Sabrina',
  'Jones, Chris',
  'Jones, Aaron',
  'Swift, Geoffrey',
  'Xiong, Fong'
];

const SORTED_ASC = [
  'Johnson, Jim',
  'Jones, Aaron',
  'Jones, Chris',
  'Ling, Mai',
  'Swift, Geoffrey',
  'Xiong, Fong',
  'Zarnecki, Sabrina'
];

const SORTED_DESC = [...SORTED_ASC].reverse();

/* ============================================================
   SUITE 1: Sortare alfabetică
   ============================================================ */
describe('Sortare alfabetică', () => {

  test('sortAsc sortează corect lista de 7 nume în ordine A→Z', () => {
    expect(sortAsc(SAMPLE_NAMES)).toEqual(SORTED_ASC);
  });

  test('sortDesc sortează corect lista de 7 nume în ordine Z→A', () => {
    expect(sortDesc(SAMPLE_NAMES)).toEqual(SORTED_DESC);
  });

  test('sortAsc pe listă goală returnează []', () => {
    expect(sortAsc([])).toEqual([]);
  });

  test('sortAsc pe un singur element returnează același element', () => {
    expect(sortAsc(['Popescu, Ion'])).toEqual(['Popescu, Ion']);
  });

  test('sortAsc nu modifică array-ul original', () => {
    const original = [...SAMPLE_NAMES];
    sortAsc(SAMPLE_NAMES);
    expect(SAMPLE_NAMES).toEqual(original);
  });

  test('Jones Aaron apare înaintea Jones Chris (sortare după prenume)', () => {
    const result = sortAsc(['Jones, Chris', 'Jones, Aaron']);
    expect(result[0]).toBe('Jones, Aaron');
  });

  test('sortAsc este case-insensitive', () => {
    const result = sortAsc(['zebra', 'Apple', 'mango']);
    expect(result).toEqual(['Apple', 'mango', 'zebra']);
  });

  test('sortDesc inversul lui sortAsc', () => {
    const asc  = sortAsc(SAMPLE_NAMES);
    const desc = sortDesc(SAMPLE_NAMES);
    expect(desc).toEqual([...asc].reverse());
  });
});

/* ============================================================
   SUITE 2: Validare input
   ============================================================ */
describe('Validare input', () => {

  test('validateName("Popescu") → true', () => {
    expect(validateName('Popescu')).toBe(true);
  });

  test('validateName("Ling, Mai") → true', () => {
    expect(validateName('Ling, Mai')).toBe(true);
  });

  test('validateName("") → false', () => {
    expect(validateName('')).toBe(false);
  });

  test('validateName("   ") → false (doar spații)', () => {
    expect(validateName('   ')).toBe(false);
  });

  test('validateName("  Ion  ") → true (spații la margini)', () => {
    expect(validateName('  Ion  ')).toBe(true);
  });
});

/* ============================================================
   SUITE 3: Numărare elemente (fără hardcoding)
   ============================================================ */
describe('Numărare elemente', () => {

  test('countNames([]) === 0', () => {
    expect(countNames([])).toBe(0);
  });

  test('countNames(SAMPLE_NAMES) === 7', () => {
    expect(countNames(SAMPLE_NAMES)).toBe(7);
  });

  test('countNames crește după adăugare', () => {
    const list = [...SAMPLE_NAMES, 'Ionescu, Maria'];
    expect(countNames(list)).toBe(8);
  });

  test('countNames scade după ștergere', () => {
    const list = SAMPLE_NAMES.slice(1);
    expect(countNames(list)).toBe(6);
  });
});

/* ============================================================
   SUITE 4: Eliminare duplicate
   ============================================================ */
describe('Eliminare duplicate', () => {

  test('removeDuplicates elimină duplicatele exacte', () => {
    const result = removeDuplicates(['Ling, Mai', 'Ling, Mai', 'Johnson, Jim']);
    expect(result).toHaveLength(2);
  });

  test('removeDuplicates pe lista fără duplicate → neschimbat', () => {
    expect(removeDuplicates(SAMPLE_NAMES)).toHaveLength(SAMPLE_NAMES.length);
  });

  test('removeDuplicates([]) → []', () => {
    expect(removeDuplicates([])).toEqual([]);
  });
});

/* ============================================================
   SUITE 5: Generare output
   ============================================================ */
describe('Generare output fișier', () => {

  test('Output conține "Lista conține 7 nume"', () => {
    const output = generateOutput(SAMPLE_NAMES);
    expect(output).toContain('Lista contine 7 nume');
  });

  test('Output conține toate cele 7 nume', () => {
    const output = generateOutput(SAMPLE_NAMES);
    SAMPLE_NAMES.forEach(name => {
      expect(output).toContain(name);
    });
  });

  test('Output pentru lista goală conține "0 nume"', () => {
    const output = generateOutput([]);
    expect(output).toContain('Lista contine 0 nume');
  });

  test('Output conține linie separator', () => {
    const output = generateOutput(SAMPLE_NAMES);
    expect(output).toMatch(/_+/);
  });
});
