const db = require('../../utils/db.js')
const moment = require('../../utils/moment.js')

module.exports = {
    name : "group-welcome-message",
    description : "Manage Message Group Welcome",
    cmd : ['welcomemessage', 'setwelcome-message'],
    menu : {
        label : 'group',
        example : 'text'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return

            if(m.body.arg) {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome_message: m.body.arg, updated_at: moment() })
                await m._reply(m.lang(msg).custom)
            } else {
                await db.update(db.group, m.isGroup.groupMetadata.id, { welcome_message: null, updated_at: moment() })
                await m._reply(m.lang(msg).default)
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}welcomemessage `text`\nContoh: {prefix}welcomemessage Selamat datang di group {group.name} {mention}.',
        custom: 'Berhasil mengganti pesan grup selamat datang.',
        default: 'Pesan grup selamat datang telah diatur ke default.'
    },
    en: {
        ex: 'usage: {prefix}welcomemessage `text`\nExample: {prefix}welcomemessage Welcome to group {group.name} {mention}.',
        custom: 'Successfully changed the group welcome message.',
        default: 'Group welcome message has been reset to default.'
    }
}

