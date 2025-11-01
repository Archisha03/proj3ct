document.addEventListener('DOMContentLoaded', async () => {
  const timeEl = document.getElementById('timer-time');
  const labelEl = document.getElementById('timer-label');
  const startBtn = document.getElementById('timer-start');
  const pauseBtn = document.getElementById('timer-pause');
  const resetBtn = document.getElementById('timer-reset');
  const focusInput = document.getElementById('focus-min');
  const breakInput = document.getElementById('break-min');
  const autoCycle = document.getElementById('auto-cycle');

  if (!timeEl) return;

  let settings = await storage.getSync(StorageKeys.pomodoroSettings, {
    focusMin: 25,
    breakMin: 5,
    autoCycle: false
  });
  let state = await storage.getLocal(StorageKeys.pomodoroState, {
    mode: 'focus', // 'focus' | 'break'
    running: false,
    startTs: null,
    durationSec: settings.focusMin * 60,
    remainingSec: settings.focusMin * 60
  });

  function updateInputsFromSettings() {
    focusInput.value = String(settings.focusMin);
    breakInput.value = String(settings.breakMin);
    autoCycle.checked = !!settings.autoCycle;
  }

  function persistSettings() {
    storage.setSync(StorageKeys.pomodoroSettings, settings);
  }

  function persistState() {
    storage.setLocal(StorageKeys.pomodoroState, state);
  }

  function setMode(mode) {
    state.mode = mode;
    const duration = mode === 'focus' ? settings.focusMin * 60 : settings.breakMin * 60;
    state.durationSec = duration;
    state.remainingSec = duration;
    labelEl.textContent = mode === 'focus' ? 'Focus' : 'Break';
  }

  function renderTime() {
    timeEl.textContent = formatDuration(Math.max(0, Math.floor(state.remainingSec)));
  }

  let intervalId = null;
  function startTimer() {
    if (state.running) return;
    state.running = true;
    state.startTs = Date.now();
    const endTs = Date.now() + state.remainingSec * 1000;
    persistState();

    chrome.alarms.create('sb_pomodoro_done', { when: endTs });

    intervalId = setInterval(() => {
      state.remainingSec = Math.max(0, Math.round((endTs - Date.now()) / 1000));
      renderTime();
      if (state.remainingSec <= 0) {
        clearInterval(intervalId);
        state.running = false;
        persistState();
        if (settings.autoCycle) {
          const next = state.mode === 'focus' ? 'break' : 'focus';
          setMode(next);
          renderTime();
          startTimer();
        }
      }
    }, 200);
  }

  function pauseTimer() {
    if (!state.running) return;
    state.running = false;
    clearInterval(intervalId);
    persistState();
    chrome.alarms.clear('sb_pomodoro_done');
  }

  function resetTimer() {
    pauseTimer();
    setMode('focus');
    renderTime();
  }

  startBtn?.addEventListener('click', startTimer);
  pauseBtn?.addEventListener('click', pauseTimer);
  resetBtn?.addEventListener('click', resetTimer);

  focusInput?.addEventListener('change', () => {
    settings.focusMin = Math.min(180, Math.max(1, parseNumber(focusInput.value, 25)));
    persistSettings();
    if (state.mode === 'focus' && !state.running) {
      setMode('focus');
      renderTime();
    }
  });

  breakInput?.addEventListener('change', () => {
    settings.breakMin = Math.min(60, Math.max(1, parseNumber(breakInput.value, 5)));
    persistSettings();
    if (state.mode === 'break' && !state.running) {
      setMode('break');
      renderTime();
    }
  });

  autoCycle?.addEventListener('change', () => {
    settings.autoCycle = !!autoCycle.checked;
    persistSettings();
  });

  updateInputsFromSettings();
  labelEl.textContent = state.mode === 'focus' ? 'Focus' : 'Break';
  renderTime();
});