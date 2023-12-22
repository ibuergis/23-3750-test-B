const fs = require('fs');


function saveData(data) {
  let json = JSON.stringify(data);
  fs.writeFileSync('./data/tasks.json', json, 'utf-8')
}

function generateResponse(code, description, data) {
  return {code, description, data};
}
function getTasks(id = 'all') {
  let parsedId = parseInt(id)
  if (isNaN(parsedId) && id !== 'all') {
    return generateResponse(400, id + ' is not a number', {});
  }

  let tasks = require('../data/tasks.json');
  if (id === 'all') {
    return generateResponse(200, 'All tasks', tasks.data);
  }

  for (let task of tasks.data) {
    if (parsedId === task.id) {
      return generateResponse(200, 'Returned Task with the ID ' + id, task);
    }
  }
  return generateResponse(400, 'Task with the ID ' + id + ' not found', {});
}

module.exports.getTasks = getTasks;

function createTask(requestBody) {
  if (typeof requestBody.title !== "string") {
    return generateResponse(400, "title is not defined or not a string", {});
  }
  if (typeof requestBody.author !== "string") {
    return generateResponse(400, "author is not defined or not a string", {});
  }
  let tasks = require('../data/tasks.json');

  let task = {
    "id": tasks.autoincrement,
    "title": requestBody.title,
    "author": requestBody.author,
    "createDate": Date.now(),
    "finishedDate": null
  }
  tasks.autoincrement++

  tasks.data.push(task)
  saveData(tasks)

  return generateResponse(201, "created new task", task)
}

module.exports.createTask = createTask
