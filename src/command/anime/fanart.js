const { default: axios } = require("axios")

module.exports = {
    name : "anime-fanart",
    description : "Generate Anime Fanart",
    cmd : ['fanart'],
    menu : {
        label : 'anime',
    },
    run : async({ m, sock }) => {
        try {
            const res = await axios.get(`https://api.waifu.pics/sfw/waifu`)
            await m._sendMessage(m.chat, { image : { url : res.data.url } }, { quoted: m })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}