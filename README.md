# Proiect 4 — Sortarea Numelor
**Materia:** Tehnologii WEB  
**Student(i):** _(completați cu numele vostru)_

---

## Descriere

Aplicație web modernă pentru sortarea alfabetică a unui fișier de nume. Utilizatorul poate:

- Vizualiza lista de nume sortată **A→Z** sau **Z→A**
- **Adăuga** nume individual sau în bulk (mai multe odată)
- **Șterge** orice intrare din listă
- **Exporta** lista sortată ca fișier `.txt`
- Rula **teste unitare** Jest integrate în interfață

Numărul de nume nu este hardcodat — se calculează dinamic din array.

---

## Structura proiectului

```
Proiect4-SortareaNumelor/
├── index.html       — interfața principală (HTML5 valid)
├── style.css        — stiluri CSS3 responsive
├── app.js           — logica client (module ES5 IIFE)
├── sort.test.js     — teste Jest pentru rulare în Node.js
├── package.json     — configurare npm/Jest
└── README.md        — această documentație
```

---

## Arhitectura aplicației (module)

```
┌─────────────────────────────────────────────┐
│                 app.js                       │
│                                             │
│  nameModule   — stare + logică pură         │
│  renderModule — actualizare DOM             │
│  exportModule — generare output + download  │
│  testModule   — suite teste simulate        │
│  Controller   — leagă modulele de interfață │
└─────────────────────────────────────────────┘
```

---

## Rulare

### Browser (fără server)
Deschide `index.html` direct în browser. Nu necesită server.

### Teste Jest (Node.js)
```bash
npm install
npm test
```

---

## Cerințe îndeplinite

| Cerință | Status |
|---|---|
| Citire listă de 7 nume predefinite | ✅ |
| Sortare alfabetică (A→Z și Z→A) | ✅ |
| Numărul de nume calculat dinamic | ✅ |
| Adăugare nume de la utilizator | ✅ |
| Afișare în fișier (export .txt) | ✅ |
| Teste unitare Jest | ✅ |
| Cod comentat și modularizat | ✅ |
| HTML5 valid, CSS3 responsive | ✅ |
| Paradigmă funcțională (sort pur) | ✅ |

---

## Paradigme de programare

- **Funcțională**: funcțiile de sortare nu modifică array-ul original (`[...arr].sort(...)`), returnând un array nou.
- **Modulară**: codul este împărțit în 4 module cu responsabilități clare (IIFE pattern).
- **Reactivă**: interfața se actualizează automat la fiecare modificare a datelor prin `renderModule.renderList()`.
