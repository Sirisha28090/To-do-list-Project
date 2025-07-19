let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = 'all';
let dragIndex = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (!text) return;
  tasks.push({ text, completed: false });
  input.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(i) {
  tasks[i].completed = !tasks[i].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  saveTasks();
  renderTasks();
}

function editTask(i) {
  const newText = prompt("Edit task:", tasks[i].text);
  if (newText && newText.trim()) {
    tasks[i].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function setFilter(filter) {
  currentFilter = filter;
  renderTasks();
}

function searchTasks() {
  renderTasks();
}

function updateTaskCount() {
  const count = tasks.filter(task => {
    if (currentFilter === 'pending') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  }).length;
  document.getElementById('taskCount').textContent = `${count} task${count !== 1 ? 's' : ''}`;
}

function renderTasks() {
  const list = document.getElementById('taskList');
  const search = document.getElementById('searchInput').value.toLowerCase();
  list.innerHTML = '';

  tasks.forEach((task, i) => {
    if (!task.text.toLowerCase().includes(search)) return;
    if (currentFilter === 'pending' && task.completed) return;
    if (currentFilter === 'completed' && !task.completed) return;

    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.setAttribute('draggable', 'true');
    li.setAttribute('data-index', i);

    li.innerHTML = `
      <span onclick="toggleTask(${i})">${task.text}</span>
      <div class="task-actions">
        <button onclick="editTask(${i})">✏</button>
        <button onclick="deleteTask(${i})">❌</button>
      </div>
    `;

    // Drag events
    li.addEventListener('dragstart', e => {
      dragIndex = i;
      li.classList.add('dragging');
    });
    li.addEventListener('dragend', e => {
      li.classList.remove('dragging');
    });
    li.addEventListener('dragover', e => {
      e.preventDefault();
    });
    li.addEventListener('drop', e => {
      e.preventDefault();
      const dropIndex = Number(li.dataset.index);
      if (dragIndex === null || dragIndex === dropIndex) return;
      const moved = tasks.splice(dragIndex, 1)[0];
      tasks.splice(dropIndex, 0, moved);
      saveTasks();
      renderTasks();
    });

    list.appendChild(li);
  });

  updateTaskCount();
}

document.getElementById('themeToggle').onclick = () => {
  document.body.classList.toggle('dark');
};

renderTasks();
