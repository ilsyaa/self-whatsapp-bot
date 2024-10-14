const db = require('../utils/db.js')
const log = require('../utils/log.js')
const middleware = require('../middleware/app.js')
const start = async() => {
    log.info("Starting bot...")
    await db.init()
    log.info(`Loaded ${middleware.size} middleware.`)
    require("../utils/loadCommands.js").loadCommands()
    require("./socket.js")
}

start()