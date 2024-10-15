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
                await m._reply(m.lang(msg).custom)
            } else {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome_message: null })
                await m._reply(m.lang(msg).default)
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        custom: 'Berhasil mengganti pesan grup selamat datang.',
        default: 'Pesan grup selamat datang telah diatur ke default.'
    },
    en: {
        custom: 'Successfully changed the group welcome message.',
        default: 'Group welcome message has been reset to default.'
    }
}

