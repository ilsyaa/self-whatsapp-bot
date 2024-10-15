module.exports = {
    name : "toimg",
    description : "Sticker To Image",
    cmd : ['toimg'],
    menu : {
        label : 'tools',
        example : '`reply sticker`'
    },
    run : async({ m, sock }) => {
        if(!['stickerMessage'].includes(m.quoted?.mtype)) return m._reply("`reply sticker.`");
        try {
            let image = await m.quoted.download()
            await m._sendMessage(m.chat, { image: image.buffer }, { quoted: m })
        } catch (error) {
            await m._reply('`Sticker tidak jelas sumbernya.`')
        }
    }
}