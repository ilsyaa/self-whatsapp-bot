const { imageToWebp, writeExifImg, videoToWebp, writeExifVid } = require("../../utils/stickerMaker");

module.exports = {
    name : "sticker",
    description : "Sticker Maker",
    cmd : ['sticker', 's'],
    menu : {
        label : 'tools',
        example : '`reply or send image with caption s`'
    },
    run : async({ m, sock }) => {
        if(!['imageMessage', 'stickerMessage', 'videoMessage'].includes(m.quoted?.mtype || m.mtype)) return m._reply(m.lang(msg).req);

        const [pack, author] = m.body.arg.trim().split('|')
        
        let image = m.quoted ? await m.quoted.download() : await m.download();

        if(image.mtype === 'imageMessage' || image.mtype === 'stickerMessage') {
            let sticker = await imageToWebp(image.buffer)
            sticker = await writeExifImg(sticker, { packname : pack || m.db.bot.exif.pack || '-', author : author || m.db.bot.exif.author || '-' })
            await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
        } else if(image.mtype === 'videoMessage') {
            let sticker = await videoToWebp(image.buffer)
            sticker = await writeExifVid(sticker, { packname : pack || m.db.bot.exif.pack || '-', author : author || m.db.bot.exif.author || '-' })
            await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
        }
    }
}

const msg = {
    id: {
        req: 'Format yang diperbolehkan: gambar, stiker, atau video.',
    },
    en: {
        req: 'Must be in the format: image, sticker, or video.'
    }
}
