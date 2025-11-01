document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const clearBtn = document.getElementById('clear-completed');

  if (!form || !input || !list) return;

  let tasks = await storage.getSync(StorageKeys.tasks, []);

  function save() {
    storage.setSync(StorageKeys.tasks, tasks);
  }

  function render() {
    list.innerHTML = '';
    for (const task of tasks) {
      const li = document.createElement('li');
      li.className = 'task-item';

      const left = document.createElement('div');
      left.style.display = 'flex';
      left.style.alignItems = 'center';
      left.style.gap = '8px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = !!task.completed;
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        save();
        title.classList.toggle('completed', !!task.completed);
      });

      const title = document.createElement('span');
      title.className = 'task-title';
      title.textContent = task.title;
      title.classList.toggle('completed', !!task.completed);

      left.appendChild(checkbox);
      left.appendChild(title);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t !== task);
        save();
        render();
      });

      li.appendChild(left);
      li.appendChild(delBtn);
      list.appendChild(li);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    tasks.unshift({ title, completed: false, createdAt: Date.now() });
    input.value = '';
    save();
    render();
  });

  clearBtn?.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    save();
    render();
  });

  render();
});