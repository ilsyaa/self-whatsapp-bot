const log = require('./src/utils/log.js')
require("dotenv").config()

// try {
//     require('./config.js')
// } catch {
//     log.error('config.js not found!') 
//     process.exit(1)
// }

require('./src/app/bootstrap.js')
