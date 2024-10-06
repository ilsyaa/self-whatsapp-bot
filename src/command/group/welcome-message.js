const db = require('../../utils/db.js')

module.exports = {
    name : "group-welcome-message",
    description : "Manage Message Group Welcome",
    cmd : ['set-welcome-msg', 'set-welcome-message'],
    menu : {
        label : 'group',
        example : '_<text>_'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return

            if(m.body.arg) {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome_message: m.body.arg })
                await m._reply('`Berhasil mengganti message group welcome.`')
            } else {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome_message: null })
                await m._reply('`Message group welcome diatur ke default.`')
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}