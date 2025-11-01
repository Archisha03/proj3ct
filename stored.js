const StorageKeys = {
  tasks: 'sb_tasks',
  pomodoroSettings: 'sb_pomodoro_settings',
  pomodoroState: 'sb_pomodoro_state',
  gpaRows: 'sb_gpa_rows',
  quickLinks: 'sb_quick_links',
  blockedSites: 'sb_blocked_sites',
  siteBypassMap: 'sb_site_bypass_map'
};

const storage = {
  async getSync(key, defaultValue) {
    const result = await chrome.storage.sync.get([key]);
    if (result && Object.prototype.hasOwnProperty.call(result, key)) return result[key];
    return defaultValue;
  },
  async setSync(key, value) {
    await chrome.storage.sync.set({ [key]: value });
  },
  async getLocal(key, defaultValue) {
    const result = await chrome.storage.local.get([key]);
    if (result && Object.prototype.hasOwnProperty.call(result, key)) return result[key];
    return defaultValue;
  },
  async setLocal(key, value) {
    await chrome.storage.local.set({ [key]: value });
  },
  async removeSync(key) { await chrome.storage.sync.remove([key]); },
  async removeLocal(key) { await chrome.storage.local.remove([key]); }
};