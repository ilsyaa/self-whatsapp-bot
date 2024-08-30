const start = async() => {
    require("../utils/loadCommands.js").loadCommands()
    require("./socket.js")
}

start()