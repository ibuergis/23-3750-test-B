express = require("express");
const app = express();
port = 3000;

const tasksHandler = require("./handler/tasks");
const authenticationHandler = require("./handler/authentication");

app.get('/tasks', (request, response) => {
    let responseJson = tasksHandler.getTasks()
    response.send(responseJson);
});

app.post('tasks')

app.listen(port, () => {
    console.log(`TaskAPI is running on port ${port}`);
});


