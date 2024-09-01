const { default: axios } = require("axios");
const { stickerImage } = require("../../utils/exif.js");
const cheerio = require("cheerio");

module.exports = {
    name : "search-sticker",
    description : "Search Sticker",
    cmd : ['searchsticker', 'ss'],
    menu : {
        label : 'tools',
        example : 'ss <url>'
    },
    run : async({ m, sock }) => {
        if(!m.body.arg) return m._reply("Cari sticker disini https://getstickerpack.com/stickers\nlalu pilih salah satu lalu kirim ss <url>\nContoh : _ss https://getstickerpack.com/stickers/dinonya-nrs_");
        if(!m.body.arg.match('https://getstickerpack.com')) return m._reply("Hanya link dari getstickerpack.com");

        const req = await axios.get(m.body.arg).catch(e => console.log(e));
        const stickers = [];
        const $ = cheerio.load(req.data);
        $('#stickerPack .row div img').each((i, el) => {
            stickers.push(el.attribs.src);
        })

        const maxResults = 10;
        for (let i = 0; i < Math.min(stickers.length, maxResults); i++) {
            const sticker = stickers[i];
            const image = await stickerImage({ url : sticker });
            await m._sendMessage(m.chat, { sticker : image }, { quoted: m })
            await new Promise(resolve => setTimeout(resolve,500));
        }
    }
}