const db = require("../../utils/db.js")

module.exports = {
    name : "bot-info",
    description : "Show Bot Info",
    cmd : ['bot', 'botinfo'],
    run : async({ m, sock }) => {
        try {
            if(!m.senderIsOwner) return
            let text = `*Bot Status*\n`
            text += `*Group*: ${db.group.getCount()} Total\n\n*`
            text += `User*: ${db.user.getCount()} Registered\n\n*`
            text += String.fromCharCode(8206).repeat(4001)
            text += `Bot Settings*\n`
            text += '{\n'
            for (const [key, value] of Object.entries(m.db.bot)) {
                if(typeof value == 'object') {
                    text += `  ${key}: ${JSON.stringify(value)},\n`
                } else {
                    text += `  ${key}: ${value},\n`
                }
            }
            text += '}'
            m._reply(text)
        } catch(error) {
            await m._reply(error.message)
        }
    }
}