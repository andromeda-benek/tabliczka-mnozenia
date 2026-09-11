const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('strona zawiera konfigurację, trening, podsumowanie i wykres historii', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  for (const id of ['setup-screen', 'number-options', 'quiz-screen', 'answer-input', 'summary-screen', 'history-chart']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
  assert.match(html, /logic\.js/);
  assert.match(html, /app\.js/);
});

test('strona nie wymaga zewnętrznych bibliotek ani serwera', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.doesNotMatch(html, /https?:\/\//);
  assert.doesNotMatch(html, /type=["']module["']/);
});

test('interfejs i historia pokazują tylko jeden typ zadań i jeden średni czas', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

  assert.doesNotMatch(html, /tekstow|historyjk/i);
  assert.doesNotMatch(html, /id=["']summary-text["']/);
  assert.match(html, /średni czas/i);
  assert.match(app, /averageSeconds/);
  assert.doesNotMatch(app, /averageTextSeconds/);
});

test('napisy w kafelkach liczby zadań są wycentrowane', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  assert.match(css, /\.length-options span\s*\{[^}]*justify-content:\s*center[^}]*align-items:\s*center[^}]*\}/s);
});

test('interfejs używa turkusowo-niebieskiej palety, a numery kroków są zielone', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

  assert.match(css, /--purple:\s*#087f8c/);
  assert.match(css, /\.step-number,\s*\.step-number\.coral\s*\{[^}]*background:\s*var\(--green\)/s);
  assert.match(css, /\.number-grid input:checked \+ span,\s*\.length-options input:checked \+ span\s*\{[^}]*background:\s*var\(--purple\)/s);
  assert.match(css, /\.result-tile\.purple,\s*\.result-tile\.blue\s*\{[^}]*background:\s*var\(--purple\)/s);
});

test('linie wykresu i ich oznaczenia mają różne kolory: niebieski i czerwony', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

  assert.match(app, /drawSeries\(\(item\) => item\.accuracyPercent, '#2563eb', yPercent\)/);
  assert.match(app, /drawSeries\(historyAverageSeconds, '#dc2626', ySeconds\)/);
  assert.match(css, /\.purple-dot\s*\{\s*background:\s*#2563eb;\s*\}/);
  assert.match(css, /\.blue-dot\s*\{\s*background:\s*#dc2626;\s*\}/);
});

test('podsumowanie ma listę błędnych zadań, a drugi błąd wymaga zatwierdzenia OK', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

  assert.match(html, /id=["']incorrect-review["']/);
  assert.match(app, /getIncorrectReview/);
  assert.match(app, /textContent\s*=\s*['"]OK['"]/);
});

test('Enter w polu odpowiedzi nie aktywuje automatycznie przycisku OK', () => {
  const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(app, /event\.preventDefault\(\)/);
});
