module.exports = {
    name : "bot-info",
    description : "Show Bot Info",
    cmd : ['bot', 'botinfo'],
    run : async({ m, sock }) => {
        try {
            if(!m.senderIsOwner) return
            let text = `*Bot Settings*\n`
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