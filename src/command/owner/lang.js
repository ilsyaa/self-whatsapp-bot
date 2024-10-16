const db = require('../../utils/db.js')
const moment = require('../../utils/moment.js')

module.exports = {
    name : "bot-lang",
    description : "Set Bot Language",
    cmd : ['lang'],
    run : async({ m, sock }) => {
        try {
            if(!m.senderIsOwner) return
            if(!m.body.arg) return m._reply(m.lang(msg).ex)

            if(!['id', 'en'].includes(m.body.arg)) return m._reply(m.lang(msg).ex)
            await db.update(db.bot, 'settings', { lang: m.body.arg.trim(), updated_at: moment() })
            await m._reply(m.lang(msg).success)
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}lang `<id/en>`\n\n*Keterangan:*\n- *id*: Mengatur bahasa ke Bahasa Indonesia.\n- *en*: Mengatur bahasa ke Bahasa Inggris.',
        success: 'Bahasa berhasil diatur.',
    },
    en: {
        ex: 'Usage: {prefix}lang `<id/en>`\n\n*Description:*\n- *id*: Set the language to Indonesian.\n- *en*: Set the language to English.',
        success: 'Language has been successfully set.',
    }
}