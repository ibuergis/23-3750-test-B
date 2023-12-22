let tasks = require("../data/tasks.json")

emptyTask

function generateResponse(code, description, data) {
    let response = {
        "code": code,
        "description": description,
        "data": data
    }
    return response
}

function getTasks() {
    return generateResponse(200, 'All tasks', tasks)
}

module.exports = { getTasks: getTasks }

