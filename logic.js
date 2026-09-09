(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.MathTrainer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const TEXT_TEMPLATES = [
    (a, b) => `W ${a} pudełkach jest po ${b} kredek. Ile kredek jest razem?`,
    (a, b) => `Na ${a} talerzach leży po ${b} ciastek. Ile ciastek leży na talerzach?`,
    (a, b) => `${a} dzieci dostało po ${b} naklejek. Ile naklejek rozdano?`,
    (a, b) => `W ogrodzie jest ${a} rzędów po ${b} kwiatów. Ile jest wszystkich kwiatów?`,
    (a, b) => `Do ${a} plecaków włożono po ${b} zeszytów. Ile zeszytów włożono?`
  ];

  function shuffle(items, random = Math.random) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function makeTask(type, a, b, templateIndex = 0) {
    return {
      id: `${type}-${a}-${b}`,
      type,
      factorA: a,
      factorB: b,
      answer: a * b,
      prompt: type === 'simple'
        ? `${a} × ${b} = ?`
        : TEXT_TEMPLATES[templateIndex % TEXT_TEMPLATES.length](a, b)
    };
  }

  function generateTasks(selectedNumbers, count, random = Math.random) {
    const selected = [...new Set(selectedNumbers.map(Number))]
      .filter((number) => Number.isInteger(number) && number >= 2 && number <= 10);
    if (!selected.length) throw new Error('Wybierz co najmniej jedną tabliczkę.');
    if (![10, 20].includes(count)) throw new Error('Trening może mieć 10 albo 20 zadań.');

    const operations = [];
    selected.forEach((a) => {
      for (let b = 2; b <= 10; b += 1) operations.push([a, b]);
    });

    function pool(type, targetCount) {
      const tasks = [];
      let round = 0;
      while (tasks.length < targetCount) {
        const shuffled = shuffle(operations, random);
        shuffled.forEach(([a, b], index) => {
          if (tasks.length >= targetCount) return;
          const task = makeTask(type, a, b, index + round);
          if (round > 0) task.id = `${task.id}-round-${round}`;
          tasks.push(task);
        });
        round += 1;
      }
      return tasks;
    }

    const perType = count / 2;
    const simple = pool('simple', perType);
    const text = pool('text', perType);
    return shuffle(simple.concat(text), random);
  }

  function summarizeResults(results) {
    const averageSeconds = (type) => {
      const matching = results.filter((result) => result.type === type && result.correct);
      if (!matching.length) return null;
      const totalMs = matching.reduce((sum, result) => sum + result.elapsedMs, 0);
      return Math.round((totalMs / matching.length / 1000) * 10) / 10;
    };
    const correct = results.filter((result) => result.correct).length;
    return {
      total: results.length,
      correct,
      accuracyPercent: results.length ? Math.round((correct / results.length) * 100) : 0,
      averageSimpleSeconds: averageSeconds('simple'),
      averageTextSeconds: averageSeconds('text')
    };
  }

  function addHistoryEntry(history, entry) {
    return history.concat(entry).slice(-100);
  }

  function isFirstTryCorrect(attemptNumber, answerMatches) {
    return attemptNumber === 1 && answerMatches === true;
  }

  function getIncorrectReview(results) {
    return results
      .filter((result) => !result.correct)
      .map((result) => ({ prompt: result.prompt, correctAnswer: result.answer }));
  }

  return { generateTasks, summarizeResults, addHistoryEntry, isFirstTryCorrect, getIncorrectReview };
});
