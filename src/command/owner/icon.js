const db = require('../../utils/db.js')
const moment = require('../../utils/moment.js')

module.exports = {
    name: "icon-message",
    description: "Custom Icon Message",
    cmd: ['iconmsg'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!['imageMessage'].includes(m.quoted ? m.quoted.mtype : m.mtype)) return m._reply(m.lang(msg).ex)
        const { buffer } = m.quoted ? await m.quoted.download() : await m.download()
        await db.update(db.bot, 'settings', { icon: buffer, updated_at: moment() })
        await m._sendMessage(m.chat, {
            text: m.lang(msg).success,
            contextInfo: {
                externalAdReply: {
                    title: 'Nakiri Whatsapp BOT',
                    body: '- Success -',
                    mediaType: 2,
                    thumbnail: buffer,
                    sourceUrl: 'https://velixs.com', 
                }
            }
        }, { quoted: m });
    }
}

const msg = {
    id: {
        ex: 'Balas gambar atau kirim gambar dengan caption `{prefix}iconmsg`.',
        success: 'Icon berhasil diubah.'
    },
    en: {
        ex: 'Reply to an image or send an image with the caption `{prefix}iconmsg`.',
        success: 'Icon has been successfully changed.'
    }
}
