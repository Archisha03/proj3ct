chrome.runtime.onInstalled.addListener(() => {
  // Initialize defaults if needed
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'sb_pomodoro_done') {
    const state = await chrome.storage.local.get(['sb_pomodoro_state']);
    const mode = state?.sb_pomodoro_state?.mode === 'break' ? 'Break' : 'Focus';
    const next = mode === 'Focus' ? 'Time for a break!' : 'Back to focus!';
    try {
      await chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: `${mode} session finished`,
        message: next,
        priority: 2
      });
    } catch (e) {
      // Notifications may be disabled; skip
    }
  }
});