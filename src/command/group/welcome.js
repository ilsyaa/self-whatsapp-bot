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
            if(!m.body.arg) return m._reply(m.lang(msg).ex)
            if(m.body.arg == 'enable' || m.body.arg == 'on' || m.body.arg == 'true') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome: true })
                await m._reply(m.lang(msg).active)
            } else if(m.body.arg == 'disable' || m.body.arg == 'off' || m.body.arg == 'false') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome: false })
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
        ex: 'Penggunaan: {prefix}set-welcome `<enable/disable>`\n\n*Keterangan:*\n- *enable*: Mengaktifkan fitur sambutan di grup ini.\n- *disable*: Menonaktifkan fitur sambutan untuk semua anggota.',
        active: 'Fitur sambutan telah diaktifkan di grup ini.',
        inactive: 'Fitur sambutan telah dinonaktifkan untuk semua anggota.'
    },
    en: {
        ex: 'Usage: {prefix}set-welcome `<enable/disable>`\n\n*Description:*\n- *enable*: Activates the welcome feature in this group.\n- *disable*: Disables the welcome feature for all members.',
        active: 'Welcome feature has been activated in this group.',
        inactive: 'Welcome feature has been disabled for all members.'
    }
}
