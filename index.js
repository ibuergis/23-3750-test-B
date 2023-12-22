const express = require('express');

const app = express();
const port = 3000;

const tasksHandler = require('./handler/tasks');
const authenticationHandler = require('./handler/authentication');

app.get('/tasks', (request, response) => {
  const responseJson = tasksHandler.getTasks();
  response.send(responseJson);
});

app.get('/tasks', (request, response) => {
  request.body;
  const responseJson = tasksHandler.getTasks();
  response.send(responseJson);
});

app.listen(port, () => {
  console.log(`TaskAPI is running on port ${port}`); // eslint-disable-line no-console
});
