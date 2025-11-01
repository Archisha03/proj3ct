document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = Array.from(document.querySelectorAll('.tab'));
  const views = {
    tasks: document.getElementById('view-tasks'),
    pomodoro: document.getElementById('view-pomodoro'),
    gpa: document.getElementById('view-gpa'),
    links: document.getElementById('view-links')
  };

  function activate(name) {
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === name));
    Object.entries(views).forEach(([key, el]) => el.classList.toggle('active', key === name));
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => activate(btn.dataset.tab));
  });
});