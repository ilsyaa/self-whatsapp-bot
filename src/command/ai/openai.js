const { default: axios } = require("axios")

module.exports = {
    name : "gpt",
    description : "AI OpenAI",
    cmd : ['gpt', 'openai'],
    menu : {
        label : 'ai',
        example : "_query_",
    },
    run : async({ m, sock }) => {
        try {
            if(!m.body.arg) return m._reply("penggunaan: gpt <teks>")
            const res = await axios.get(`https://widipe.com/openai?text=${m.body.arg}`)
            await m._sendMessage(m.chat, { text: res.data.result }, { quoted: m })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}