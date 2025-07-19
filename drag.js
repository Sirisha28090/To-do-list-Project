const taskList = document.getElementById("taskList");
let dragIndex;

taskList.addEventListener("dragstart", (e) => {
  dragIndex = +e.target.dataset.index;
});

taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const dragging = document.querySelector("[draggable].dragging");
});

taskList.addEventListener("drop", (e) => {
  const dropIndex = +e.target.closest("li").dataset.index;
  const item = tasks.splice(dragIndex, 1)[0];
  tasks.splice(dropIndex, 0, item);
  saveTasks();
  renderTasks();
});
