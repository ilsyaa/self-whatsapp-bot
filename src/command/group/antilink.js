const db = require('../../utils/db.js')

module.exports = {
    name : "group-antilink",
    description : "Menghandle fitur antilink di group",
    cmd : ['antilink'],
    menu : {
        label : 'group',
        example : '<enable/disable>'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.body.arg) return m._reply(m.lang(msg).ex)

            if(m.body.arg == 'enable' || m.body.arg == 'on' || m.body.arg == 'true') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { antilink: true })
                await m._reply(m.lang(msg).active)
            } else if(m.body.arg == 'disable' || m.body.arg == 'off' || m.body.arg == 'false') {
                await db.update(db.group, m.isGroup.groupMetadata.id, { antilink: false })
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
        ex: 'Penggunaan: {prefix}antilink `<enable/disable>`\n\nContoh:\n▷ {prefix}antilink enable  → Mengaktifkan fitur antilink.\n▷ {prefix}antilink disable → Menonaktifkan fitur antilink.',
        active: 'Antilink telah diaktifkan di grup ini.',
        inactive: 'Antilink telah dinonaktifkan untuk semua anggota.'
    },
    en: {
        ex: 'Usage: {prefix}antilink `<enable/disable>`\n\nExample:\n▷ {prefix}antilink enable  → Activates the antilink feature.\n▷ {prefix}antilink disable → Deactivates the antilink feature.',
        active: 'Antilink has been activated in this group.',
        inactive: 'Antilink has been disabled for all members.'
    }
}
