let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    input.value = "";
    saveTasks();
    renderTasks();
  }
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
  if (newText !== null && newText.trim() !== '') {
    tasks[i].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  const search = document.getElementById('searchInput').value.toLowerCase();

  tasks.forEach((task, i) => {
    const matchesSearch = task.text.toLowerCase().includes(search);
    const matchesFilter =
      currentFilter === 'all' ||
      (currentFilter === 'pending' && !task.completed) ||
      (currentFilter === 'completed' && task.completed);

    if (matchesSearch && matchesFilter) {
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
      list.appendChild(li);
    }
  });
  updateTaskCount();
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
    return currentFilter === 'all' ||
      (currentFilter === 'pending' && !task.completed) ||
      (currentFilter === 'completed' && task.completed);
  }).length;
  document.getElementById('taskCount').textContent = ${count} task${count !== 1 ? 's' : ''};
}

document.getElementById('themeToggle').onclick = () => {
  document.body.classList.toggle('dark');
};

renderTasks();
