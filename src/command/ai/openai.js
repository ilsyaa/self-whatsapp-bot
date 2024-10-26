const { default: axios } = require("axios")

module.exports = {
    name : "gpt",
    description : "AI OpenAI",
    cmd : ['gpt', 'openai'],
    menu : {
        label : 'ai',
        example : "text",
    },
    run : async({ m, sock }) => {
        try {
            if(!m.body.arg) return m._reply(m.lang(msg).ex)
            const res = await axios.get(`https://widipe.com/openai?text=${m.body.arg}`)
            await m._sendMessage(m.chat, { text: res.data.result }, { quoted: m })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}gpt `text`'
    },
    en: {
        ex: 'usage: {prefix}gpt `text`'
    }
}