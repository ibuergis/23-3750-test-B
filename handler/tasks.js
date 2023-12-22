const fs = require('fs');

function saveData(data) {
  const json = JSON.stringify(data);
  fs.writeFileSync('./data/tasks.json', json, 'utf-8');
}

function generateResponse(code, description, data) {
  return { code, description, data };
}

function getTasks(id = 'all') {
  const parsedId = parseInt(id, 10);
  if (Number.isNaN(parsedId) && id !== 'all') {
    return generateResponse(400, `${id} is not a number`, null);
  }

  const tasks = require('../data/tasks.json');
  if (id === 'all') {
    return generateResponse(200, 'All tasks', tasks.data);
  }

  for (const task of tasks.data) {
    if (parsedId === task.id) {
      return generateResponse(200, `Returned Task with the ID ${id}`, task);
    }
  }
  return generateResponse(400, `Task with the ID ${id} not found`, null);
}

module.exports.getTasks = getTasks;

function createTask(requestBody) {
  if (typeof requestBody.title !== 'string') {
    return generateResponse(400, 'title is not defined or not a string', null);
  }
  if (typeof requestBody.author !== 'string') {
    return generateResponse(400, 'author is not defined or not a string', null);
  }
  const tasks = require('../data/tasks.json');

  const task = {
    id: tasks.autoincrement,
    title: requestBody.title,
    author: requestBody.author,
    createDate: Date.now(),
    finishedDate: null,
  };
  tasks.autoincrement += 1;

  tasks.data.push(task);
  saveData(tasks);

  return generateResponse(201, 'created new task', task);
}

module.exports.createTask = createTask;

function editTask(id, requestBody) {
  const tasks = require('../data/tasks.json');
  const parsedId = parseInt(id, 10);
  if (Number.isNaN(parsedId)) {
    return generateResponse(400, `id "${id}" is not a number`, null);
  }
  for (let i = 0; i < tasks.data.length; i += 1) {
    if (parsedId === tasks.data[i].id) {
      if (typeof requestBody.title === 'string') {
        tasks.data[i].title = requestBody.title;
      }
      if (typeof requestBody.author === 'string') {
        tasks.data[i].author = requestBody.author;
      }
      if (!Number.isNaN(parseInt(requestBody.finishedDate, 10))) {
        tasks.data[i].finishedDate = parseInt(requestBody.finishedDate, 10);
      }
      saveData(tasks);
      return generateResponse(200, `Edited Task with the ID ${id}`, tasks.data[i]);
    }
  }
  return generateResponse(400, `Task with the ID ${id} not found`, null);
}

module.exports.editTask = editTask;

function deleteTask(id) {
  const tasks = require('../data/tasks.json');
  const parsedId = parseInt(id, 10);
  if (Number.isNaN(parsedId)) {
    return generateResponse(400, `id "${id}" is not a number`, null);
  }

  for (const task of tasks.data) {
    if (parsedId === task.id) {
      const index = tasks.data.indexOf(task)
      tasks.data.splice(index, 1)
      saveData(tasks)
      return generateResponse(200, `Deleted Task with the ID ${id}`, task);
    }
  }
  return generateResponse(400, `Task with the ID ${id} not found`, null);
}

module.exports.deleteTask = deleteTask
