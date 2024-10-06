const db = require('../../utils/db.js')

module.exports = {
    name : "group-antilink",
    description : "Menghandle fitur antilink di group",
    cmd : ['antilink'],
    menu : {
        label : 'group',
        example : '_<enable/disable>_'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.body.arg) return m._reply("penggunaan: antilink `<enable/disable>`")

            if(m.body.arg == 'enable' || m.body.arg == 'on' || m.body.arg == 'true') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { antilink: true })
                await m._reply('`Antilink diaktifkan di group ini.`')
            } else if(m.body.arg == 'disable' || m.body.arg == 'off' || m.body.arg == 'false') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { antilink: false })
                await m._reply('`Antilink dinonaktifkan untuk semua member.`')
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}