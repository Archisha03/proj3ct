document.addEventListener('DOMContentLoaded', async () => {
  const tbody = document.getElementById('gpa-rows');
  const addBtn = document.getElementById('gpa-add-row');
  const clearBtn = document.getElementById('gpa-clear');
  const valueEl = document.getElementById('gpa-value');
  if (!tbody) return;

  let rows = await storage.getSync(StorageKeys.gpaRows, []);

  function save() { storage.setSync(StorageKeys.gpaRows, rows); }

  function compute() {
    let totalCredits = 0;
    let totalPoints = 0;
    for (const r of rows) {
      const c = Number(r.credits);
      const g = Number(r.grade);
      if (Number.isFinite(c) && Number.isFinite(g)) {
        totalCredits += c;
        totalPoints += c * g;
      }
    }
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    valueEl.textContent = gpa.toFixed(2);
  }

  function render() {
    tbody.innerHTML = '';
    rows.forEach((r, idx) => {
      const tr = document.createElement('tr');
      const course = document.createElement('td');
      const credits = document.createElement('td');
      const grade = document.createElement('td');
      const actions = document.createElement('td');

      const inCourse = document.createElement('input');
      inCourse.type = 'text';
      inCourse.value = r.course || '';
      inCourse.addEventListener('input', () => { r.course = inCourse.value; save(); });

      const inCredits = document.createElement('input');
      inCredits.type = 'number';
      inCredits.min = '0';
      inCredits.step = '0.5';
      inCredits.value = r.credits ?? '';
      inCredits.addEventListener('input', () => { r.credits = inCredits.value; save(); compute(); });

      const inGrade = document.createElement('input');
      inGrade.type = 'number';
      inGrade.min = '0';
      inGrade.max = '4';
      inGrade.step = '0.01';
      inGrade.value = r.grade ?? '';
      inGrade.addEventListener('input', () => { r.grade = inGrade.value; save(); compute(); });

      const del = document.createElement('button');
      del.textContent = 'Delete';
      del.addEventListener('click', () => {
        rows.splice(idx, 1);
        save();
        render();
        compute();
      });

      course.appendChild(inCourse);
      credits.appendChild(inCredits);
      grade.appendChild(inGrade);
      actions.appendChild(del);
      tr.appendChild(course);
      tr.appendChild(credits);
      tr.appendChild(grade);
      tr.appendChild(actions);
      tbody.appendChild(tr);
    });
  }

  addBtn?.addEventListener('click', () => {
    rows.push({ course: '', credits: '', grade: '' });
    save();
    render();
  });

  clearBtn?.addEventListener('click', () => {
    rows = [];
    save();
    render();
    compute();
  });

  render();
  compute();
});