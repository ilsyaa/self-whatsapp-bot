module.exports = {
    name : "toimg",
    description : "Sticker To Image",
    cmd : ['toimg'],
    menu : {
        label : 'tools',
        example : '`reply sticker`'
    },
    run : async({ m, sock }) => {
        if(!['stickerMessage'].includes(m.quoted?.mtype)) return m._reply(m.lang(msg).ex);
        try {
            let image = await m.quoted.download()
            await m._sendMessage(m.chat, { image: image.buffer }, { quoted: m })
        } catch (error) {
            await m._reply(m.lang(msg).failed)
        }
    }
}

const msg = {
    id: {
        ex: 'Balas dengan stiker.',
        failed: 'Stiker tidak valid atau rusak.'
    },
    en: {
        ex: 'Reply with a sticker.',
        failed: 'Sticker is invalid or corrupted.'
    }
}