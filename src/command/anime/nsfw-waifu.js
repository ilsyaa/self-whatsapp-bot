const { default: axios } = require('axios')
const lang = require('../../utils/lang.js')

module.exports = {
    name : "anime-nsfw-waifu",
    description : "Random Anime NSFW Waifu",
    cmd : ['nsfw-waifu'],
    menu : {
        label : 'anime',
    },
    run : async({ m, sock }) => {
        if(!m.senderIsOwner && m.isGroup && !m.db.group?.nsfw) return m._reply(msg[lang(m)].nsfw)
        try {
            const res = await axios.get(`https://api.waifu.pics/nsfw/waifu`)
            await m._sendMessage(m.chat, { image : { url : res.data.url } }, { quoted: m })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        nfsw: 'NSFW mode tidak diaktifkan di grup ini.'
    },
    en: {
        nfsw: 'NSFW mode is not enabled in this group.'
    }
}