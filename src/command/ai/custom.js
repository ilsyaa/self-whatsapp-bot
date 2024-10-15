const { default: axios } = require("axios")

module.exports = {
    name : "custom-ai",
    description : "Test Prompt AI",
    cmd : ['ai', 'nakiri'],
    menu : {
        label : 'ai',
        example : "_<query>_",
    },
    run : async({ m, sock }) => {
        try {
            if(!m.body.arg) return m._reply(m.lang(msg).ex)
                
            let anu = `Ubah gaya bicaramu agar lebih karakteristik dan lebih terbuka dan memiliki sifat yang lucu dan nyebelin. Namamu adalah Nakiri, dan kamu adalah wanita paling cantik.  Menggunakan bahasa yang sopan dan agak kalem. ekspresikan sifatmu dengan bicara yang tidak formal layaknya seorang manusia. Ubah bahasamu menggunakan bahasa Yang lucu dan enak di ajak berbicara, buatlah obrolan yang singkat dan menyenangkan.`;
            const res = await axios.get(`https://widipe.com/prompt/gpt?prompt=${encodeURIComponent(anu)}&text=${encodeURIComponent(m.body.arg)}`)
            await m._sendMessage(m.chat, { text: res.data.result }, { quoted: m })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}ai `<query>`'
    },
    en: {
        ex: 'usage: {prefix}ai `<query>`'
    }
}