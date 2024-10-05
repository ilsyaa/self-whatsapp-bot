const db = require('../../utils/db.js')

module.exports = {
    name : "group-mode",
    description : "Mengatur respon bot di group",
    cmd : ['gmode'],
    menu : {
        label : 'gmode',
        example : '_<admin-only/all>_'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.body.arg) return m._reply("penggunaan: gmode `<admin/all>`")

            if(m.body.arg == 'adminonly' || m.body.arg == 'admin') {
                await db.group.put(m.isGroup.groupMetadata.id, { mode: 'admin-only' })
                await m._reply('`Bot berhasil di setting hanya merespon kepada admin saja.`')
            } else if(m.body.arg == 'all') {
                await db.group.put(m.isGroup.groupMetadata.id, { mode: 'all' })
                await m._reply('`Bot berhasil di setting untuk bisa merespon ke semua member.`')
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}