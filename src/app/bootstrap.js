const db = require('../utils/db.js')
const start = async() => {
    await db.init()
    require("../utils/loadCommands.js").loadCommands()
    require("./socket.js")
}

start()