const { default: axios } = require("axios");
const { imageToWebp, writeExifImg, videoToWebp, writeExifVid } = require("../../utils/stickerMaker");
const validateUrl = require("../../utils/validate-url.js");
const exp = require('../../utils/exp.js');
const uploader = require('../../utils/uploader.js');

module.exports = {
    name : "sticker-nobg",
    description : "Sticker No Background",
    cmd : ['nobg'],
    menu : {
        label : 'tools',
    },
    run : async({ m, sock }) => {
        let url = validateUrl(m.body.arg) ? m.body.arg : false
        let image;
        if(!['imageMessage', 'stickerMessage'].includes(m.quoted?.mtype || m.mtype) && !url) return m._reply(m.lang(msg).ex);
        if(url) {
            try {
                image = await axios.get(url, { responseType: 'arraybuffer' })
            }catch(error) { return m._reply(m.lang(msg).invalidUrl) }
            if(!['video', 'image'].includes(image.headers.get('content-type').split('/')[0])) return m._reply(m.lang(msg).req)
            image = {
                buffer : image.data,
                ext : image.headers.get('content-type').split('/')[1],
                mtype : image.headers.get('content-type').split('/')[0]+'Message'
            }
        } else {
            image = m.quoted ? await m.quoted.download() : await m.download();
        }

        if(image.mtype === 'imageMessage' || image.mtype === 'stickerMessage') {
            let sticker = await uploader.quax(image.buffer);
            sticker = (await axios.get(`https://api.nyxs.pw/tools/removebg?url=${sticker}`)).data.result
            sticker = await imageToWebp((await axios.get(sticker, { responseType: 'arraybuffer' })).data)
            sticker = await writeExifImg(sticker, { packname : m.db.bot.exif.pack || '-', author : m.db.bot.exif.author || '-' })
            exp.add(m.sender, exp.random(1, 5))
            await m._sendMessage(m.chat, { sticker : sticker }, { quoted: m })
        } else {
            m._reply(m.lang(msg).req)
        }
    }
}

const msg = {
    id: {
        ex: '*Penggunaan*:\n- Balas gambar atau sticker dengan caption `{prefix}nobg`\n- Kirim gambar dengan caption `{prefix}nobg`\n- {prefix}nobg <url>\n\n*Keterangan*:*\n- *<url>*: URL berisi gambar.',
        req: 'Format yang diperbolehkan: `gambar` atau `stiker`.',
        invalidUrl: 'URL tidak valid.'
    },
}
