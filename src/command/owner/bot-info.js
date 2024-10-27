const db = require("../../utils/db.js")
const util = require('util')

module.exports = {
    name : "bot-info",
    description : "Show Bot Info",
    cmd : ['bot', 'botinfo'],
    run : async({ m, sock }) => {
        try {
            if(!m.senderIsOwner) return
            let text = `*Bot Status*\n\n`
            text += `*Group*: ${db.group.getCount()} Total\n*`
            text += `User*: ${db.user.getCount()} Registered\n\n*`
            text += String.fromCharCode(8206).repeat(4001)
            text += `Bot Settings*\n`
            text += util.format(m.db.bot)
            m._reply(text)
        } catch(error) {
            await m._reply(error.message)
        }
    }
}