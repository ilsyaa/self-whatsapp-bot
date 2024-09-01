const { stickerImage } = require("../../utils/exif.js");

module.exports = {
    name : "sticker",
    description : "Sticker Maker",
    cmd : ['sticker', 's'],
    menu : {
        label : 'tools',
        example : '`reply or send image with caption s`'
    },
    run : async({ m, sock }) => {
        if(!['imageMessage', 'stickerMessage'].includes(m.quoted?.mtype || m.mtype)) return m._reply("Harus berupa gambar/sticker.");

        const [pack, author] = m.body.arg.trim().split('|')
        
        let image = m.quoted ? await m.quoted.download() : await m.download();
        const sticker = await stickerImage(image.buffer, { pack, author });
        await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
    }
}