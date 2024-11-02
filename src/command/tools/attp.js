const { attp } = require('../../utils/attp.js')
const { writeExifVid } = require("../../utils/stickerMaker");
const exp = require('../../utils/exp.js');
const fs = require('fs')

module.exports = {
    name : "sticker-attp",
    description : "Sticker Attp",
    cmd : ['attp'],
    menu : {
        label : 'tools',
    },
    run : async({ m, sock }) => {
        if(!m.body.arg) return m._reply(m.lang(msg).ex)
            
        try {
            let sticker = await attp(m.body.arg)
            sticker = await writeExifVid(fs.readFileSync(sticker), { packname : m.db.bot.exif.pack || '-', author : m.db.bot.exif.author || '-' })
            exp.add(m.sender, exp.random(1, 5))
            await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: '*Penggunaan*: {prefix}attp `text`',
    },
    en: {
        ex: '*Usage*: {prefix}attp `text`',
    }
}
