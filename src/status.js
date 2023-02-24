export function saveLocal(list) {
  window.localStorage.setItem('localTasks', JSON.stringify(list));
}

export function status(elem, list) {
  list.forEach((task) => {
    if (task === elem) {
      task.isCompleted = !task.isCompleted;
    }
  });
  saveLocal(list);
}

export function add(list) {
  list.push({ description: document.querySelector('#newTask').value, isCompleted: false, index: list.length });
  document.querySelector('#newTask').value = '';
  saveLocal(list);
}

export function updateIndex(list) {
  let i = 0;
  list.forEach((elem) => {
    elem.index = i;
    i += 1;
  });
}

export function removeDone(list) {
  list = list.filter((elem) => elem.isCompleted === false);
  updateIndex(list);
  saveLocal(list);
}