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
