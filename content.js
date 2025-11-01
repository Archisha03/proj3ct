(async function() {
  try {
    const url = new URL(window.location.href);
    const hostname = url.hostname.toLowerCase();

    const bypassMap = await chrome.storage.local.get([StorageKeys.siteBypassMap]);
    const map = bypassMap?.[StorageKeys.siteBypassMap] || {};
    const bypassUntil = map[hostname];
    if (bypassUntil && Date.now() < bypassUntil) {
      return;
    }

    const blocked = await chrome.storage.sync.get([StorageKeys.blockedSites]);
    const patterns = blocked?.[StorageKeys.blockedSites] || [];
    const isBlocked = patterns.some(p => p && hostname.includes(String(p).toLowerCase()));
    if (!isBlocked) return;

    document.documentElement.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.inset = '0';
    wrapper.style.background = '#0f172a';
    wrapper.style.color = 'white';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
    const h = document.createElement('h1');
    h.textContent = 'Blocked by Student Buddy';
    const p = document.createElement('p');
    p.textContent = hostname;
    const btn = document.createElement('button');
    btn.textContent = 'Allow for 5 minutes';
    btn.style.marginTop = '12px';
    btn.style.padding = '8px 12px';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', async () => {
      const current = (await chrome.storage.local.get([StorageKeys.siteBypassMap]))?.[StorageKeys.siteBypassMap] || {};
      current[hostname] = Date.now() + 5 * 60 * 1000;
      await chrome.storage.local.set({ [StorageKeys.siteBypassMap]: current });
      location.reload();
    });
    wrapper.appendChild(h);
    wrapper.appendChild(p);
    wrapper.appendChild(btn);
    document.documentElement.appendChild(wrapper);
  } catch (e) {
    // ignore failures
  }
})();