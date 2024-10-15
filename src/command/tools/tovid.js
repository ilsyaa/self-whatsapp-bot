const config = require("../../../config.js")
const path = require("path")
const { webpToVideo } = require('../../utils/ffmpeg.js')

module.exports = {
    name : "tovid",
    description : "Sticker To Video",
    cmd : ['tovid', 'tovideo'],
    menu : {
        label : 'tools',
        example : '`reply sticker`'
    },
    run : async({ m, sock }) => {
        if(!['stickerMessage'].includes(m.quoted?.mtype)) return m._reply("`reply sticker.`");
        try {
            let media = await m.quoted.saveMedia(path.join(config.STORAGE_PATH, 'temp'))
            let video = await webpToVideo(media)
            await m._sendMessage(m.chat, { video }, { quoted: m })
        } catch (error) {
            await m._reply('`Sticker tidak jelas sumbernya.`')
        }
    }
}