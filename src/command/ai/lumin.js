const { default: axios } = require("axios")

module.exports = {
    name : "lumin-ai-image",
    description : "Identifer Image",
    cmd : ['lumin', 'identifer'],
    menu : {
        label : 'ai',
        example : "_<text>_",
    },
    run : async({ m, sock }) => {
        try {
            if(!m.body.arg) return m._reply(m.lang(msg).ex)
            if(!['imageMessage'].includes(m.quoted?.mtype || m.mtype)) return m._reply(m.lang(msg).req);
            const { buffer } = m.quoted ? await m.quoted.download() : await m.download()
            const response = await axios.post('https://luminai.my.id/', {
                content: m.body.arg,
                imageBuffer: buffer
            });
            
            await m._sendMessage(m.chat, { text: response.data.result }, { quoted: m })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}lumin `<text>`\n\n*Keterangan:*\nIdentifer gambar dengan ai\n- *<text>*: Prompt yang ingin Anda gunakan.',
        req: 'Kirim gambar untuk di identifikasi.'
    },
    en: {
        ex: 'Usage: {prefix}lumin `<text>`\n\n*Description:*\nIdentifer image with ai\n- *<text>*: Prompt parameter you want to use.',
        req: 'Send image to be identified.'
    }
}
