const config = require("../../../config.js")
const path = require("path")
const { webpToVideo } = require('../../utils/stickerMaker.js')

module.exports = {
    name : "tovid",
    description : "Sticker To Video",
    cmd : ['tovid', 'tovideo'],
    menu : {
        label : 'tools',
        example : 'reply sticker'
    },
    run : async({ m, sock }) => {
        if(!['stickerMessage'].includes(m.quoted?.mtype)) return m._reply(m.lang(msg).ex);
        try {
            let media = await m.quoted.saveMedia(path.join(config.STORAGE_PATH, 'temp'))
            let video = await webpToVideo(media)
            await m._sendMessage(m.chat, { video }, { quoted: m })
        } catch (error) {
            await m._reply(m.lang(msg).failed)
        }
    }
}

const msg = {
    id: {
        ex: 'Balas dengan stiker.',
        failed: 'Stiker tidak valid atau rusak.'
    },
    en: {
        ex: 'Reply with a sticker.',
        failed: 'Sticker is invalid or corrupted.'
    }
}
