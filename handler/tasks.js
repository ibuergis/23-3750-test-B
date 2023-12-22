const tasks = require('../data/tasks.json');

function generateResponse(code, description, data) {
  const response = {
    code,
    description,
    data,
  };
  return response;
}

function getTasks() {
  return generateResponse(200, 'All tasks', tasks);
}

module.exports = { getTasks };
