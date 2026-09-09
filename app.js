(function () {
  'use strict';

  const STORAGE_HISTORY = 'multiplicationTrainer.history.v1';
  const STORAGE_SETTINGS = 'multiplicationTrainer.settings.v1';
  const state = { tasks: [], current: 0, attempts: 0, results: [], startedAt: 0, completed: false };
  const $ = (id) => document.getElementById(id);
  const elements = {
    setup: $('setup-screen'), quiz: $('quiz-screen'), summary: $('summary-screen'),
    numberOptions: $('number-options'), selectAll: $('select-all'), setupError: $('setup-error'),
    prompt: $('question-prompt'), kind: $('task-kind'), progressLabel: $('progress-label'),
    progressBar: $('progress-bar'), answer: $('answer-input'), feedback: $('feedback'),
    check: $('check-button'), start: $('start-button'), again: $('again-button'),
    summaryAccuracy: $('summary-accuracy'), summarySimple: $('summary-simple'),
    summaryText: $('summary-text'), summaryDetail: $('summary-detail'),
    incorrectReviewSection: $('incorrect-review-section'), incorrectReview: $('incorrect-review'),
    chart: $('history-chart'), emptyHistory: $('empty-history'), clearHistory: $('clear-history')
  };

  function numberCheckboxes() { return [...elements.numberOptions.querySelectorAll('input[type="checkbox"]')]; }
  function selectedNumbers() { return numberCheckboxes().filter((box) => box.checked).map((box) => Number(box.value)); }
  function taskCount() { return Number(document.querySelector('input[name="task-count"]:checked').value); }

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (_) { return fallback; }
  }
  function saveJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* trening nadal działa bez zapisu */ }
  }
  function history() {
    const value = readJson(STORAGE_HISTORY, []);
    return Array.isArray(value) ? value.slice(-100) : [];
  }

  function restoreSettings() {
    const settings = readJson(STORAGE_SETTINGS, null);
    if (!settings) return;
    numberCheckboxes().forEach((box) => { box.checked = settings.numbers.includes(Number(box.value)); });
    const countOption = document.querySelector(`input[name="task-count"][value="${settings.count}"]`);
    if (countOption) countOption.checked = true;
    updateSelectAll();
  }

  function updateSelectAll() {
    const boxes = numberCheckboxes();
    elements.selectAll.checked = boxes.every((box) => box.checked);
    elements.selectAll.indeterminate = boxes.some((box) => box.checked) && !elements.selectAll.checked;
  }

  function showScreen(name) {
    elements.setup.hidden = name !== 'setup';
    elements.quiz.hidden = name !== 'quiz';
    elements.summary.hidden = name !== 'summary';
  }

  function startTraining() {
    const numbers = selectedNumbers();
    if (!numbers.length) {
      elements.setupError.textContent = 'Wybierz co najmniej jedną tabliczkę.';
      return;
    }
    elements.setupError.textContent = '';
    const count = taskCount();
    saveJson(STORAGE_SETTINGS, { numbers, count });
    state.tasks = MathTrainer.generateTasks(numbers, count);
    state.current = 0;
    state.attempts = 0;
    state.results = [];
    state.completed = false;
    showScreen('quiz');
    displayTask();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function displayTask() {
    const task = state.tasks[state.current];
    state.attempts = 0;
    state.completed = false;
    state.startedAt = performance.now();
    elements.prompt.textContent = task.prompt;
    elements.kind.textContent = task.type === 'simple' ? 'Działanie' : 'Zadanie tekstowe';
    elements.kind.style.background = task.type === 'simple' ? 'var(--purple-soft)' : 'var(--coral-soft)';
    elements.kind.style.color = task.type === 'simple' ? 'var(--purple-dark)' : '#c44741';
    elements.progressLabel.textContent = `Zadanie ${state.current + 1} z ${state.tasks.length}`;
    elements.progressBar.style.width = `${((state.current + 1) / state.tasks.length) * 100}%`;
    elements.answer.value = '';
    elements.answer.disabled = false;
    elements.feedback.textContent = '';
    elements.feedback.className = 'feedback';
    elements.check.textContent = 'Sprawdź';
    elements.answer.focus();
  }

  function finishTask(correct, message, feedbackKind = correct ? 'success' : 'failure', requiresOk = false) {
    const task = state.tasks[state.current];
    state.completed = true;
    state.results.push({
      type: task.type,
      prompt: task.prompt,
      answer: task.answer,
      correct,
      resolvedOnAttempt: feedbackKind === 'success' ? state.attempts : null,
      elapsedMs: performance.now() - state.startedAt
    });
    elements.feedback.textContent = message;
    elements.feedback.className = `feedback ${feedbackKind}`;
    elements.answer.disabled = true;
    if (requiresOk) elements.check.textContent = 'OK';
    else elements.check.textContent = state.current === state.tasks.length - 1 ? 'Zobacz podsumowanie' : 'Następne zadanie';
    elements.check.focus();
  }

  function checkAnswer() {
    if (state.completed) {
      if (state.current === state.tasks.length - 1) finishTraining();
      else { state.current += 1; displayTask(); }
      return;
    }
    const raw = elements.answer.value.trim();
    if (raw === '') {
      elements.feedback.textContent = 'Najpierw wpisz odpowiedź.';
      elements.feedback.className = 'feedback failure';
      return;
    }
    const task = state.tasks[state.current];
    state.attempts += 1;
    if (Number(raw) === task.answer) {
      const countedCorrect = MathTrainer.isFirstTryCorrect(state.attempts, true);
      const message = countedCorrect
        ? 'Brawo! Doskonała odpowiedź ⭐'
        : 'Dobrze za drugim razem! To zadanie trafi do powtórki.';
      finishTask(countedCorrect, message, 'success');
    } else if (state.attempts === 1) {
      elements.feedback.textContent = 'Jeszcze nie — spróbuj drugi raz!';
      elements.feedback.className = 'feedback failure';
      elements.answer.value = '';
      elements.answer.focus();
    } else {
      finishTask(false, `Poprawna odpowiedź to ${task.answer}. Następnym razem się uda!`, 'failure', true);
    }
  }

  function formatSeconds(value) { return value == null ? '–' : `${value.toFixed(1)} s`; }

  function renderIncorrectReview() {
    const review = MathTrainer.getIncorrectReview(state.results);
    elements.incorrectReview.replaceChildren();
    elements.incorrectReviewSection.hidden = review.length === 0;
    review.forEach((item) => {
      const row = document.createElement('li');
      const prompt = document.createElement('span');
      const answer = document.createElement('strong');
      prompt.className = 'review-prompt';
      answer.className = 'review-answer';
      prompt.textContent = item.prompt;
      answer.textContent = `Poprawna odpowiedź: ${item.correctAnswer}`;
      row.append(prompt, answer);
      elements.incorrectReview.append(row);
    });
  }

  function finishTraining() {
    const summary = MathTrainer.summarizeResults(state.results);
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      date: new Date().toISOString(),
      accuracyPercent: summary.accuracyPercent,
      averageSimpleSeconds: summary.averageSimpleSeconds,
      averageTextSeconds: summary.averageTextSeconds,
      taskCount: summary.total
    };
    saveJson(STORAGE_HISTORY, MathTrainer.addHistoryEntry(history(), entry));
    elements.summaryAccuracy.textContent = `${summary.accuracyPercent}%`;
    elements.summarySimple.textContent = formatSeconds(summary.averageSimpleSeconds);
    elements.summaryText.textContent = formatSeconds(summary.averageTextSeconds);
    elements.summaryDetail.textContent = `${summary.correct} poprawnych z ${summary.total} zadań.`;
    renderIncorrectReview();
    showScreen('summary');
    drawHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function drawHistory() {
    const data = history();
    const canvas = elements.chart;
    elements.emptyHistory.hidden = data.length > 0;
    if (!data.length) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(320, rect.width || 800);
    const height = 340;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, width, height);

    const pad = { left: 48, right: 48, top: 24, bottom: 48 };
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;
    const maxSeconds = Math.max(10, ...data.flatMap((item) => [item.averageSimpleSeconds || 0, item.averageTextSeconds || 0]));
    const roundedMaxSeconds = Math.ceil(maxSeconds / 5) * 5;
    const x = (index) => pad.left + (data.length === 1 ? chartW / 2 : index * chartW / (data.length - 1));
    const yPercent = (value) => pad.top + chartH - (value / 100) * chartH;
    const ySeconds = (value) => pad.top + chartH - (value / roundedMaxSeconds) * chartH;

    ctx.font = '12px Trebuchet MS, sans-serif';
    ctx.lineWidth = 1;
    for (let tick = 0; tick <= 4; tick += 1) {
      const y = pad.top + chartH - tick * chartH / 4;
      ctx.strokeStyle = '#eeeaf5';
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(width - pad.right, y); ctx.stroke();
      ctx.fillStyle = '#777e94';
      ctx.textAlign = 'right'; ctx.fillText(`${tick * 25}%`, pad.left - 8, y + 4);
      ctx.textAlign = 'left'; ctx.fillText(`${Math.round(tick * roundedMaxSeconds / 4)}s`, width - pad.right + 8, y + 4);
    }

    const drawSeries = (key, color, yFn) => {
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3; ctx.lineJoin = 'round';
      ctx.beginPath();
      data.forEach((item, index) => {
        const px = x(index); const py = yFn(item[key] || 0);
        if (index === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      });
      ctx.stroke();
      data.forEach((item, index) => {
        ctx.beginPath(); ctx.arc(x(index), yFn(item[key] || 0), 3.5, 0, Math.PI * 2); ctx.fill();
      });
    };
    drawSeries('accuracyPercent', '#6c4cf1', yPercent);
    drawSeries('averageSimpleSeconds', '#18a9d6', ySeconds);
    drawSeries('averageTextSeconds', '#ff7168', ySeconds);

    const labels = Math.min(6, data.length);
    ctx.fillStyle = '#777e94'; ctx.textAlign = 'center'; ctx.font = '11px Trebuchet MS, sans-serif';
    for (let tick = 0; tick < labels; tick += 1) {
      const index = labels === 1 ? 0 : Math.round(tick * (data.length - 1) / (labels - 1));
      const date = new Date(data[index].date);
      ctx.fillText(date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }), x(index), height - 20);
    }
  }

  elements.selectAll.addEventListener('change', () => {
    numberCheckboxes().forEach((box) => { box.checked = elements.selectAll.checked; });
    updateSelectAll();
  });
  numberCheckboxes().forEach((box) => box.addEventListener('change', updateSelectAll));
  elements.start.addEventListener('click', startTraining);
  elements.check.addEventListener('click', checkAnswer);
  elements.answer.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    checkAnswer();
  });
  elements.again.addEventListener('click', () => { showScreen('setup'); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  elements.clearHistory.addEventListener('click', () => {
    if (window.confirm('Czy na pewno usunąć całą historię treningów?')) {
      localStorage.removeItem(STORAGE_HISTORY);
      drawHistory();
    }
  });
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawHistory, 120); });

  restoreSettings();
  updateSelectAll();
  drawHistory();
})();
