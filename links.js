document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('links-list');
  if (!list) return;

  const links = await storage.getSync(StorageKeys.quickLinks, [
    { title: 'Google Scholar', url: 'https://scholar.google.com' },
    { title: 'Khan Academy', url: 'https://www.khanacademy.org' },
    { title: 'GitHub', url: 'https://github.com' }
  ]);

  list.innerHTML = '';
  for (const link of links) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.url;
    a.textContent = link.title || link.url;
    a.target = '_blank';
    li.appendChild(a);
    list.appendChild(li);
  }
});