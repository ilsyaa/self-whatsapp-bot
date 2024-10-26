const db = require('../../utils/db.js')

module.exports = {
    name : "group-welcome-background",
    description : "Manage Background Group Welcome",
    cmd : ['set-welcome-bg', 'set-welcome-background'],
    menu : {
        label : 'group',
        example : 'url'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return

            if(m.body.arg) {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome_background: m.body.arg })
                await m._reply(m.lang(msg).custom)
            } else {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome_background: null })
                await m._reply(m.lang(msg).default)
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        custom: 'Latar belakang grup selamat datang berhasil diatur sesuai kustom.',
        default: 'Latar belakang grup selamat datang telah diatur kembali ke default.'
    },
    en: {
        custom: 'Background group welcome has been successfully set to custom.',
        default: 'Background group welcome has been reset to default.'
    }
}
