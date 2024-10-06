const db = require('../../utils/db.js')

module.exports = {
    name : "group-welcome",
    description : "Manage Welcome Message Group",
    cmd : ['set-welcome'],
    menu : {
        label : 'group',
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.body.arg) return m._reply("penggunaan: set-welcome <enable/disable>")
            if(m.body.arg == 'enable' || m.body.arg == 'on' || m.body.arg == 'true') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome: true })
                await m._reply('`Fitur welcome diaktifkan di group ini.`')
            } else if(m.body.arg == 'disable' || m.body.arg == 'off' || m.body.arg == 'false') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome: false })
                await m._reply('`Fitur welcome dinonaktifkan untuk semua member.`')
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}