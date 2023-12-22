express = require("express");
const app = express();
port = 3000;

const tasksHandler = require("./handler/tasks");
const authenticationHandler = require("./handler/authentication");

app.get('/tasks', (request, response) => {
    let tasks = tasksHandler.getAllTasks()

    let responseJson = {
        "code": 200,
        "description": "All tasks that are saved",
        "data": tasks
    }
    response.send(responseJson);
});

app.listen(port, () => {
    console.log(`TaskAPI is running on port ${port}`);
});


