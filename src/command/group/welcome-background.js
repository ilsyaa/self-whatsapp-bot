const db = require('../../utils/db.js')

module.exports = {
    name : "group-welcome-background",
    description : "Manage Background Group Welcome",
    cmd : ['set-welcome-bg', 'set-welcome-background'],
    menu : {
        label : 'group',
        example : '_<url>_'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return

            if(m.body.arg) {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome_background: m.body.arg })
                await m._reply('`Background group welcome diatur.`')
            } else {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome_background: null })
                await m._reply('`Background group welcome diatur ke default.`')
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}