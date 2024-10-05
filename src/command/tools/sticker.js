const { imageToWebp, writeExifImg, videoToWebp, writeExifVid } = require("../../utils/stickerMaker");
const config = require("../../../config.js");

module.exports = {
    name : "sticker",
    description : "Sticker Maker",
    cmd : ['sticker', 's'],
    menu : {
        label : 'tools',
        example : '`reply or send image with caption s`'
    },
    run : async({ m, sock }) => {
        if(!['imageMessage', 'stickerMessage', 'videoMessage'].includes(m.quoted?.mtype || m.mtype)) return m._reply("Harus berupa gambar/sticker/video.");

        const [pack, author] = m.body.arg.trim().split('|')
        
        let image = m.quoted ? await m.quoted.download() : await m.download();

        if(image.mtype === 'imageMessage' || image.mtype === 'stickerMessage') {
            let sticker = await imageToWebp(image.buffer)
            sticker = await writeExifImg(sticker, { packname : pack || config.STICKER_PACK, author : author || config.STICKER_AUTHOR })
            await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
        } else if(image.mtype === 'videoMessage') {
            let sticker = await videoToWebp(image.buffer)
            sticker = await writeExifVid(sticker, { packname : pack || config.STICKER_PACK, author : author || config.STICKER_AUTHOR })
            await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
        }
    }
}