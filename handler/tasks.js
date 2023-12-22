const fs = require('fs');


function saveData(data) {
  let json = JSON.stringify(data);
  fs.writeFileSync('./data/tasks.json', json, 'utf-8')
}

function generateResponse(code, description, data) {
  return {code, description, data};
}
function getTasks() {
  let tasks = require('../data/tasks.json');
  return generateResponse(200, 'All tasks', tasks.data);
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

  task = {
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
