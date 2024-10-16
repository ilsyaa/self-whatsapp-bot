const { imageToWebp, writeExifImg, videoToWebp, writeExifVid } = require("../../utils/stickerMaker");

module.exports = {
    name : "sticker-take",
    description : "Sticker Stealer",
    cmd : ['take', 'steal'],
    menu : {
        label : 'tools',
    },
    run : async({ m, sock }) => {
        if(!['stickerMessage'].includes(m.quoted?.mtype || m.mtype)) return m._reply(m.lang(msg).ex);
        const [pack, author] = m.body.arg.trim().split('|')
        if(!pack && !author) return m._reply(m.lang(msg).ex)
        try {
            let image = m.quoted ? await m.quoted.download() : await m.download();
            if(image.mtype === 'imageMessage' || image.mtype === 'stickerMessage') {
                let sticker = await imageToWebp(image.buffer)
                sticker = await writeExifImg(sticker, { packname : pack, author })
                await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
            } else if(image.mtype === 'videoMessage') {
                let sticker = await videoToWebp(image.buffer)
                sticker = await writeExifVid(sticker, { packname : pack, author })
                await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
            }
        } catch (error) {
            await m._reply(m.lang(msg).failed)
        }
    }
}

const msg = {
    id: {
        ex: '*Penggunaan*: Balas sticker dengan caption `{prefix}take <pack>|<author>`\n\n*Keterangan:*\n- *<pack>*: Nama paket yang akan digunakan untuk exif.\n- *<author>*: Nama penulis yang akan digunakan untuk exif.',
        failed: 'Stiker tidak valid atau rusak.'
    },
    en: {
        ex: '*Usage*: Reply to a sticker with the caption `{prefix}take <pack>|<author>`\n\n*Description:*\n- *<pack>*: The pack name to be used for exif.\n- *<author>*: The author name to be used for exif.',
        failed: 'Sticker is invalid or corrupted.'
    }
}
