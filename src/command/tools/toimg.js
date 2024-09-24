const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const config = require("../../../config.js")
const path = require("path")

module.exports = {
    name : "toimg",
    description : "Sticker To Image",
    cmd : ['toimg'],
    menu : {
        label : 'tools',
        example : '`reply sticker`'
    },
    run : async({ m, sock }) => {
        if(!['stickerMessage'].includes(m.quoted?.mtype)) return m._reply("`reply sticker.`");
        
        let media = await m.quoted.saveMedia(path.join(config.STORAGE_PATH, 'temp'))
        await m._sendMessage(m.chat, media, { quoted: m })
    }
}