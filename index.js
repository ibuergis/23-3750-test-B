const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const port = 3000;
const app = express();
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const tasksHandler = require('./handler/tasks');
const authenticationHandler = require('./handler/authentication');

app.get('/tasks', (request, response) => {
  const responseJson = tasksHandler.getTasks(request.cookies);
  response.status(responseJson.code);
  response.send(responseJson);
});

app.post('/tasks', (request, response) => {
  const task = request.body;
  const responseJson = tasksHandler.createTask(request.cookies, task);
  response.status(responseJson.code);
  response.send(responseJson);
});

app.get('/tasks/:id', (request, response) => {
  const responseJson = tasksHandler.getTasks(request.cookies, request.params.id);
  response.status(responseJson.code);
  response.send(responseJson);
});

app.patch('/tasks/:id', (request, response) => {
  const responseJson = tasksHandler.editTask(request.cookies, request.params.id, request.body);
  response.status(responseJson.code);
  response.send(responseJson);
});

app.delete('/tasks/:id', (request, response) => {
  const responseJson = tasksHandler.deleteTask(request.cookies, request.params.id);
  response.status(responseJson.code);
  response.send(responseJson);
});

app.post('/login', (request, response) => {
  const responseJson = authenticationHandler.authenticate(request, response);
  response.status(responseJson.code);
  response.send(responseJson);
});

app.get('/verify', (request, response) => {
  const responseJson = authenticationHandler.cookieIsValid(request.cookies);
  response.status(responseJson.code);
  response.send(responseJson);
});

app.delete('/logout', (request, response) => {
  const responseJson = authenticationHandler.deleteCookies(request, response);
  response.status(responseJson.code).send();
});

app.listen(port, () => {
  console.log(`TaskAPI is running on port ${port}`); // eslint-disable-line no-console
});
