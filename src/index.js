import * as task from './populate.js';
import * as stat from './status.js';
import './style.css';

let list = [];
const listEl = document.querySelector('ul');

function todoList() {
  if (window.localStorage.getItem('localTasks')) {
    const localTasks = window.localStorage.getItem('localTasks');
    list = JSON.parse(localTasks);
  }
  document.querySelector('.todo-list').innerHTML = '';
  list.forEach((item) => {
    const taskElement = document.createElement('li');
    taskElement.classList.add('task');
    if (item.isCompleted) {
      taskElement.classList.add('completed');
    }
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-check');
    checkbox.addEventListener('click', () => {
      stat.status(item, list);
      todoList();
    });
    checkbox.checked = item.isCompleted;
    taskElement.appendChild(checkbox);
    const taskText = document.createElement('input');
    taskText.classList = 'task-text';
    taskText.value = item.description;
    taskText.addEventListener('change', () => {
      if (taskText.value.length > 0) {
        item.description = taskText.value;
        stat.saveLocal(list);
      }
    });
    taskElement.appendChild(taskText);

    const taskEditButton = document.createElement('button');
  taskEditButton.classList.add('edit-button');
  taskEditButton.innerHTML = '<i class="fas fa-edit edit-button"></i>';
  taskElement.appendChild(taskEditButton);

    const dragIcon = document.createElement('button');
    dragIcon.classList = 'far fa-trash-alt deleteBtn';
    taskElement.appendChild(dragIcon);
    taskElement.draggable = 'true';
    document.querySelector('.todo-list').appendChild(taskElement);
  });
}

function removeItem(e) {
  if (!e.target.classList.contains('deleteBtn')) {
    return;
  }
  const btn = e.target;
  list.forEach((task) => {
    if (task.description === btn.parentElement.children[1].value) {
      list.splice(list.indexOf(task), 1);
    }
  });
  btn.closest('li').remove();
  task.updateIndex(list);
  stat.saveLocal(list);
}

listEl.addEventListener('click', removeItem);
todoList();
document.querySelector('#taskForm').addEventListener('submit', (event) => {
  event.preventDefault();
  task.add(list);
  todoList();
});
document.querySelector('.clearer').addEventListener('click', () => {
  task.removeDone(list);
  todoList();
});

function editItem(e) {
  if (!e.target.classList.contains('edit-button')) {
    return;
  }
  const btn = e.target;
  const taskElement = btn.closest('li');
  const taskText = taskElement.querySelector('.task-text');

  taskText.disabled = false;
  taskText.focus();

  taskText.addEventListener('blur', () => {
    const newDescription = taskText.value.trim();

    if (newDescription.length > 0) {
      const index = list.findIndex(task => task.description === taskText.value);
      if (index !== -1) {
        // If there is already a task with the same description, don't allow editing
        taskText.value = list[index].description;
      } else {
        // Update the task description and save to local storage
        const task = list.find(task => task.description === btn.parentElement.children[1].value);
        task.description = newDescription;
        stat.saveLocal(list);
      }
    }

    taskText.disabled = true;
    todoList();
  });
}

listEl.addEventListener('click', editItem);