const { default: axios } = require('axios')

module.exports = {
    name : "anime-nsfw-waifu",
    description : "Random Anime NSFW Waifu",
    cmd : ['nsfw-waifu'],
    menu : {
        label : 'anime',
    },
    run : async({ m, sock }) => {
        if(!m.senderIsOwner && m.isGroup && !m.db.group?.nsfw) return m._reply(m.lang(msg).nsfw)
        try {
            m._react(m.key, '🔍')
            const res = await axios.get(`https://api.waifu.pics/nsfw/waifu`)
            await m._sendMessage(m.chat, { image : { url : res.data.url } }, { quoted: m })
            m._react(m.key, '✅')
        } catch(error) {
            m._react(m.key, '❌')
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