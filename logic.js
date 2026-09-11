(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.MathTrainer = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';


  function shuffle(items, random = Math.random) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function makeTask(a, b) {
    return {
      id: `simple-${a}-${b}`,
      type: 'simple',
      factorA: a,
      factorB: b,
      answer: a * b,
      prompt: `${a} × ${b} = ?`
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

    function pool(targetCount) {
      const tasks = [];
      let round = 0;
      while (tasks.length < targetCount) {
        const shuffled = shuffle(operations, random);
        shuffled.forEach(([a, b]) => {
          if (tasks.length >= targetCount) return;
          const task = makeTask(a, b);
          if (round > 0) task.id = `${task.id}-round-${round}`;
          tasks.push(task);
        });
        round += 1;
      }
      return tasks;
    }

    return pool(count);
  }

  function summarizeResults(results) {
    const correctResults = results.filter((result) => result.correct);
    const averageSeconds = correctResults.length
      ? Math.round((correctResults.reduce((sum, result) => sum + result.elapsedMs, 0) / correctResults.length / 1000) * 10) / 10
      : null;
    const correct = correctResults.length;
    return {
      total: results.length,
      correct,
      accuracyPercent: results.length ? Math.round((correct / results.length) * 100) : 0,
      averageSeconds
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
