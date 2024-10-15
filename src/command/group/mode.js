const db = require('../../utils/db.js')

module.exports = {
    name : "group-mode",
    description : "Mengatur respon bot di group",
    cmd : ['gmode'],
    menu : {
        label : 'group',
        example : '_<admin-only/all>_'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.body.arg) return m._reply(m.lang(msg).ex)

            if(m.body.arg == 'adminonly' || m.body.arg == 'admin') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { mode: 'admin-only' })
                await m._reply(m.lang(msg).active)
            } else if(m.body.arg == 'all') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { mode: 'all' })
                await m._reply(m.lang(msg).inactive)
            } else {
                await m._reply(m.lang(msg).ex)
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}gmode `<admin/all>`\n\n*Keterangan:*\n- *admin*: Bot hanya akan merespons perintah dari anggota yang memiliki status admin.\n- *all*: Bot akan merespons perintah dari semua anggota grup.',
        active: 'Bot telah diatur untuk hanya merespons kepada admin saja.',
        inactive: 'Bot telah diatur untuk merespons kepada semua anggota.'
    },
    en: {
        ex: 'Usage: {prefix}gmode `<admin/all>`\n\n*Description:*\n- *admin*: Bot will only respond to commands from members with admin status.\n- *all*: Bot will respond to commands from all group members.',
        active: 'Bot has been set to only respond to admin.',
        inactive: 'Bot has been set to respond to all members.'
    }
}
