const middleware = new Map();

middleware.set('antilink.js', require('./antilink.js'))
middleware.set('timeout.js', require('./timeout.js'))
middleware.set('bot-mode.js', require('./bot-mode.js'))
middleware.set('group-mode.js', require('./group-mode.js'))

module.exports = middleware