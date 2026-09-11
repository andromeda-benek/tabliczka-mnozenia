const test = require('node:test');
const assert = require('node:assert/strict');
const trainer = require('../logic.js');

test('generator tworzy trening złożony wyłącznie ze zwykłych działań', () => {
  const tasks = trainer.generateTasks([2, 5, 10], 10, () => 0.42);

  assert.equal(tasks.length, 10);
  assert.ok(tasks.every((task) => task.type === 'simple'));
  assert.ok(tasks.every((task) => /^\d+ × \d+ = \?$/.test(task.prompt)));
  assert.equal(new Set(tasks.map((task) => task.id)).size, 10);
  assert.ok(tasks.every((task) => [2, 5, 10].includes(task.factorA)));
  assert.ok(tasks.every((task) => task.factorB >= 2 && task.factorB <= 10));
  assert.ok(tasks.every((task) => task.answer === task.factorA * task.factorB));
});

test('generator tworzy pełne 20 zwykłych działań także dla jednej wybranej tabliczki', () => {
  const tasks = trainer.generateTasks([7], 20, () => 0.31);

  assert.equal(tasks.length, 20);
  assert.ok(tasks.every((task) => task.type === 'simple'));
  assert.ok(tasks.every((task) => task.factorA === 7));
});

test('podsumowanie liczy jeden średni czas tylko z odpowiedzi poprawnych za pierwszym razem', () => {
  const summary = trainer.summarizeResults([
    { type: 'simple', correct: true, elapsedMs: 2000 },
    { type: 'simple', correct: false, resolvedOnAttempt: 2, elapsedMs: 4000 },
    { type: 'simple', correct: false, resolvedOnAttempt: null, elapsedMs: 6000 },
    { type: 'simple', correct: true, elapsedMs: 10000 }
  ]);

  assert.deepEqual(summary, {
    total: 4,
    correct: 2,
    accuracyPercent: 50,
    averageSeconds: 6
  });
});

test('brak odpowiedzi poprawnej za pierwszym razem daje pustą średnią', () => {
  const summary = trainer.summarizeResults([
    { type: 'simple', correct: false, resolvedOnAttempt: 2, elapsedMs: 3000 }
  ]);

  assert.equal(summary.averageSeconds, null);
});

test('tylko poprawna pierwsza próba jest klasyfikowana jako poprawne zadanie', () => {
  assert.equal(trainer.isFirstTryCorrect(1, true), true);
  assert.equal(trainer.isFirstTryCorrect(2, true), false);
  assert.equal(trainer.isFirstTryCorrect(1, false), false);
  assert.equal(trainer.isFirstTryCorrect(2, false), false);
});

test('historia zachowuje najwyżej 100 najnowszych treningów', () => {
  let history = [];
  for (let index = 0; index < 105; index += 1) {
    history = trainer.addHistoryEntry(history, { id: index, date: `2026-01-${index}` });
  }

  assert.equal(history.length, 100);
  assert.equal(history[0].id, 5);
  assert.equal(history[99].id, 104);
});

test('lista powtórkowa zawiera tylko błędne zadania i ich poprawne odpowiedzi', () => {
  const review = trainer.getIncorrectReview([
    { prompt: '7 × 8 = ?', answer: 56, correct: false, userAnswers: [55, 54] },
    { prompt: '2 × 3 = ?', answer: 6, correct: true, userAnswers: [6] }
  ]);

  assert.deepEqual(review, [{ prompt: '7 × 8 = ?', correctAnswer: 56 }]);
  assert.equal(Object.hasOwn(review[0], 'userAnswers'), false);
});
