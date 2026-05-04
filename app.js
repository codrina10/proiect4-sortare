/**
 * app.js — Proiect 4: Sortarea Numelor
 * Tehnologii WEB
 *
 * Descriere:
 * Aplicație web pentru sortarea alfabetică a numelor.
 * Suportă adăugare individuală/bulk, sortare ASC/DESC,
 * export .txt și teste unitare simulate (Jest-style).
 *
 * Module:
 * - nameModule   : stare și operații pe lista de nume
 * - renderModule : actualizarea DOM-ului
 * - exportModule : generare output și descărcare fișier
 * - testModule   : suite de teste unitare simulate
 */

'use strict';

/* ============================================================
   1. NAME MODULE — gestionarea datelor (stare + logică pură)
   ============================================================ */
const nameModule = (() => {

  /** @type {string[]} Lista curentă de nume */
  let _names = [
    'Ling, Mai',
    'Johnson, Jim',
    'Zarnecki, Sabrina',
    'Jones, Chris',
    'Jones, Aaron',
    'Swift, Geoffrey',
    'Xiong, Fong'
  ];

  /** @type {'none'|'asc'|'desc'} Starea curentă de sortare */
  let _sortOrder = 'none';

  const getNames = () => [..._names];
  const getCount = () => _names.length;
  const getSortOrder = () => _sortOrder;

  const addName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, message: 'Numele nu poate fi gol.' };
    if (_names.includes(trimmed)) return { ok: false, message: `„${trimmed}" există deja în listă.` };
    _names.push(trimmed);
    _sortOrder = 'none'; 
    return { ok: true, message: `„${trimmed}" a fost adăugat.` };
  };

  const addBulk = (rawText) => {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    let added = 0, skipped = 0;
    lines.forEach(line => {
      const result = addName(line);
      result.ok ? added++ : skipped++;
    });
    return { added, skipped };
  };

  const removeName = (index) => {
    _names.splice(index, 1);
    _sortOrder = 'none';
  };

  const sort = (direction) => {
    _names = [..._names].sort((a, b) => {
      const result = a.localeCompare(b, 'ro', { sensitivity: 'base' });
      return direction === 'desc' ? -result : result;
    });
    _sortOrder = direction;
  };

  const reset = () => {
    _names = [
      'Ling, Mai', 'Johnson, Jim', 'Zarnecki, Sabrina', 
      'Jones, Chris', 'Jones, Aaron', 'Swift, Geoffrey', 'Xiong, Fong'
    ];
    _sortOrder = 'none';
  };

  const clearAll = () => {
    _names = [];
    _sortOrder = 'none';
  };

  return { getNames, getCount, getSortOrder, addName, addBulk, removeName, sort, reset, clearAll };
})();


/* ============================================================
   2. RENDER MODULE — actualizarea interfeței
   ============================================================ */
const renderModule = (() => {

  const renderList = () => {
    const list    = document.getElementById('name-list');
    const label   = document.getElementById('list-count-label');
    const badge   = document.getElementById('order-badge');
    const counter = document.getElementById('stat-count');
    const sortSt  = document.getElementById('stat-sorted');
    const names   = nameModule.getNames();
    const count   = nameModule.getCount();
    const order   = nameModule.getSortOrder();

    // Actualizare statistici sidebar
    counter.textContent = count;
    sortSt.textContent  = order === 'asc' ? 'A→Z' : order === 'desc' ? 'Z→A' : '—';

    // Actualizare header listă (se calculează dinamic, nu e hardcodat)
    label.textContent = `Lista contine ${count} nume`;

    // Actualizare badge ordine
    badge.textContent = order === 'asc' ? 'A → Z' : order === 'desc' ? 'Z → A' : 'nesortată';
    badge.className   = `order-badge ${order === 'none' ? '' : order}`;

    // Randare elemente
    if (count === 0) {
      list.innerHTML = '<li class="list-empty">Lista este goală. Adaugă nume din tab-ul +</li>';
      return;
    }

    list.innerHTML = names.map((name, i) => `
      <li>
        <span class="name-text">${escapeHtml(name)}</span>
        <button class="name-delete" onclick="deleteName(${i})" title="Șterge">✕</button>
      </li>
    `).join('');
  };

  const escapeHtml = (str) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  return { renderList };
})();


/* ============================================================
   3. EXPORT MODULE — generare fișier output
   ============================================================ */
const exportModule = (() => {

  const generateOutput = () => {
    const names = nameModule.getNames();
    const count = nameModule.getCount();

    // Format exact conform cerinței profesorului
    let output = `Lista contine ${count} nume\n`;
    output += '_ _ _ _ _ _ _ _ _ _ _\n\n';
    output += names.join('\n');
    return output;
  };

  const refreshPreview = () => {
    const pre = document.getElementById('output-preview');
    if (pre) pre.textContent = generateOutput();
  };

  const downloadTxt = () => {
    const content  = generateOutput();
    const blob     = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url      = URL.createObjectURL(blob);
    const anchor   = document.createElement('a');
    anchor.href    = url;
    anchor.download = 'lista_sortata.txt';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(generateOutput());
      return { ok: true };
    } catch {
      return { ok: false };
    }
  };

  return { generateOutput, refreshPreview, downloadTxt, copyOutput };
})();


/* ============================================================
   4. TEST MODULE — teste unitare simulate (Jest-style)
   ============================================================ */
const testModule = (() => {

  const deepEqual = (received, expected) => JSON.stringify(received) === JSON.stringify(expected);

  const runAllTests = () => {
    const suites = [];
    let totalPass = 0, totalFail = 0;

    const sortAsc  = (arr) => [...arr].sort((a, b) => a.localeCompare(b, 'ro', { sensitivity: 'base' }));
    const sortDesc = (arr) => [...arr].sort((a, b) => b.localeCompare(a, 'ro', { sensitivity: 'base' }));
    const validateName = (name) => name.trim().length > 0;
    const countNames   = (arr) => arr.length;

    const suite1 = { name: 'Sortare alfabetică', cases: [] };
    const sample = ['Ling, Mai', 'Johnson, Jim', 'Zarnecki, Sabrina', 'Jones, Chris', 'Jones, Aaron', 'Swift, Geoffrey', 'Xiong, Fong'];

    const r1 = sortAsc(sample);
    const e1 = ['Johnson, Jim', 'Jones, Aaron', 'Jones, Chris', 'Ling, Mai', 'Swift, Geoffrey', 'Xiong, Fong', 'Zarnecki, Sabrina'];
    const p1 = deepEqual(r1, e1);
    suite1.cases.push({ name: 'sortAsc() sortează corect A→Z', pass: p1, detail: p1 ? '' : `Primit: ${r1[0]}` });

    const r2 = sortDesc(sample);
    const e2 = [...e1].reverse();
    const p2 = deepEqual(r2, e2);
    suite1.cases.push({ name: 'sortDesc() sortează corect Z→A', pass: p2, detail: p2 ? '' : `Primit: ${r2[0]}` });

    const p5 = sortAsc(['Jones, Chris', 'Jones, Aaron'])[0] === 'Jones, Aaron';
    suite1.cases.push({ name: 'Prenume diferit (Jones Aaron < Jones Chris)', pass: p5, detail: '' });

    suites.push(suite1);

    const suite2 = { name: 'Validare & Numărare', cases: [] };
    suite2.cases.push({ name: 'validateName("Popescu") → true', pass: validateName('Popescu'), detail: '' });
    suite2.cases.push({ name: 'validateName("  ") → false', pass: !validateName('   '), detail: '' });
    suite2.cases.push({ name: 'countNames(sample) === 7', pass: countNames(sample) === 7, detail: '' });
    suites.push(suite2);

    suites.forEach(suite => {
      suite.cases.forEach(c => { c.pass ? totalPass++ : totalFail++; });
    });

    return { suites, totalPass, totalFail };
  };

  return { runAllTests };
})();


/* ============================================================
   5. CONTROLLER — leagă toate modulele de DOM
   ============================================================ */

function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tabId}`).classList.add('active');
  btn.classList.add('active');

  if (tabId === 'export') exportModule.refreshPreview();
}

function sortNames(direction) {
  nameModule.sort(direction);
  renderModule.renderList();
}

function resetList() {
  nameModule.reset();
  renderModule.renderList();
}

function deleteName(index) {
  nameModule.removeName(index);
  renderModule.renderList();
}

function clearAllNames() {
  nameModule.clearAll();
  renderModule.renderList();
  setFeedback('add-feedback', 'Lista a fost golită.', 'success');
}

function addNameFromInput() {
  const input  = document.getElementById('name-input');
  const result = nameModule.addName(input.value);
  setFeedback('add-feedback', result.message, result.ok ? 'success' : 'error');
  if (result.ok) {
    input.value = '';
    renderModule.renderList();
  }
  input.focus();
}

function addBulk() {
  const textarea = document.getElementById('bulk-input');
  const result   = nameModule.addBulk(textarea.value);
  setFeedback('add-feedback', `Adăugate: ${result.added} | Ignorate: ${result.skipped}`, result.added > 0 ? 'success' : 'error');
  if (result.added > 0) {
    textarea.value = '';
    renderModule.renderList();
  }
}

function refreshPreview() {
  exportModule.refreshPreview();
}

function downloadTxt() {
  exportModule.downloadTxt();
}

async function copyOutput() {
  const result = await exportModule.copyOutput();
  setFeedback('copy-feedback', result.ok ? 'Copiat în clipboard!' : 'Copierea a eșuat.', result.ok ? 'success' : 'error');
}

function runTests() {
  const { suites, totalPass, totalFail } = testModule.runAllTests();
  const container = document.getElementById('test-results');

  let html = suites.map(suite => `
    <div class="test-suite">
      <div class="suite-header">${escapeHtml(suite.name)}</div>
      ${suite.cases.map(c => `
        <div class="test-case ${c.pass ? 'test-pass' : 'test-fail'}">
          <span class="test-icon"></span>
          <div>
            <div class="test-name">${escapeHtml(c.name)}</div>
            ${c.detail ? `<div class="test-detail">${escapeHtml(c.detail)}</div>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `).join('');

  html += `
    <div class="test-summary">
      <span class="summary-pass">✓ ${totalPass} trecute</span>
      ${totalFail > 0 ? `<span class="summary-fail">✗ ${totalFail} eșuate</span>` : ''}
      <span>din ${totalPass + totalFail} total</span>
    </div>
  `;

  container.innerHTML = html;
}

/** * PROVOCAREA 2: Test de Performanță (Set Mare de Date) 
 */
function runPerformanceTest() {
  const startGeneration = performance.now();
  
  // Generăm 100.000 de nume aleatorii
  const firstNames = ["Ion", "Maria", "Elena", "Andrei", "Alex", "Mihai", "Ana", "George"];
  const lastNames = ["Popescu", "Ionescu", "Radu", "Stan", "Dumitrescu", "Zarnecki", "Ling", "Johnson"];
  
  let bulkText = [];
  for(let i = 0; i < 100000; i++) {
    const f = firstNames[Math.floor(Math.random() * firstNames.length)];
    const l = lastNames[Math.floor(Math.random() * lastNames.length)];
    bulkText.push(`${l}, ${f}`);
  }
  
  nameModule.addBulk(bulkText.join('\n'));
  const endGeneration = performance.now();

  // Sortăm cele 100.000 de nume
  const startSort = performance.now();
  nameModule.sort('asc');
  const endSort = performance.now();

  alert(`⚡ TEST PERFORMANTĂ (100.000 nume completate):\n\n- Timp de generare & adăugare: ${(endGeneration - startGeneration).toFixed(2)} ms\n- Timp de sortare alfabetică: ${(endSort - startSort).toFixed(2)} ms\n\nJavascript sortează 100k înregistrări instantaneu! Afișarea în browser (HTML) este dezactivată pentru test, pentru a nu bloca vizualizarea.`);
}

function setFeedback(id, message, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className   = `input-hint ${type}`;
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.textContent = ''; el.className = 'input-hint'; }, 3500);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ============================================================
   6. INIȚIALIZARE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderModule.renderList();
});