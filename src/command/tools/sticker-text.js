const sharp = require("sharp");
const { stickerImage } = require("../../utils/exif.js");
const config = require("../../../config.js");

module.exports = {
    name : "sticker-text",
    description : "Sticker Text Maker",
    cmd : ['st', 'stickertext'],
    // menu : {
    //     label : 'tools',
    //     example : '_<placement>|<text>_ `placement: top, center, bottom`'
    // },
    run : async({ m, sock }) => {
        if(!['imageMessage', 'stickerMessage'].includes(m.quoted?.mtype || m.mtype)) return m._reply("Harus berupa gambar/sticker.");
        const [placement, text, size] = m.body.arg.trim().split('|')
        let image = m.quoted ? await m.quoted.download() : await m.download();
        const sticker = await stickerImage(
                image.buffer, 
                { 
                    pack : config.STICKER_PACK , 
                    author : config.STICKER_AUTHOR 
                }, 
                { 
                    text : { 
                        placement, 
                        size,
                        value : text
                    } 
                }
            );
        await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
    }
}