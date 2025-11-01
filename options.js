document.addEventListener('DOMContentLoaded', async () => {
  const linkForm = document.getElementById('link-form');
  const linkTitle = document.getElementById('link-title');
  const linkUrl = document.getElementById('link-url');
  const linksUl = document.getElementById('links');

  const blockForm = document.getElementById('block-form');
  const blockInput = document.getElementById('block-pattern');
  const blockedUl = document.getElementById('blocked');

  let links = await storage.getSync(StorageKeys.quickLinks, []);
  let blocked = await storage.getSync(StorageKeys.blockedSites, []);

  function renderLinks() {
    linksUl.innerHTML = '';
    links.forEach((l, idx) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = `${l.title || l.url} — ${l.url}`;
      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.addEventListener('click', async () => {
        links.splice(idx, 1);
        await storage.setSync(StorageKeys.quickLinks, links);
        renderLinks();
      });
      li.appendChild(span);
      li.appendChild(del);
      linksUl.appendChild(li);
    });
  }

  function renderBlocked() {
    blockedUl.innerHTML = '';
    blocked.forEach((p, idx) => {
      const li = document.createElement('li');
      const span = document.createElement('span');
      span.textContent = p;
      const del = document.createElement('button');
      del.textContent = 'Unblock';
      del.addEventListener('click', async () => {
        blocked.splice(idx, 1);
        await storage.setSync(StorageKeys.blockedSites, blocked);
        renderBlocked();
      });
      li.appendChild(span);
      li.appendChild(del);
      blockedUl.appendChild(li);
    });
  }

  linkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = linkTitle.value.trim();
    const url = linkUrl.value.trim();
    if (!url) return;
    links.push({ title, url });
    linkTitle.value = '';
    linkUrl.value = '';
    await storage.setSync(StorageKeys.quickLinks, links);
    renderLinks();
  });

  blockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pattern = blockInput.value.trim();
    if (!pattern) return;
    blocked.push(pattern);
    blockInput.value = '';
    await storage.setSync(StorageKeys.blockedSites, blocked);
    renderBlocked();
  });

  renderLinks();
  renderBlocked();
});