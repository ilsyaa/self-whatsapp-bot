const { default: axios } = require("axios")

module.exports = {
    name : "custom-ai",
    description : "Test Prompt AI",
    cmd : ['ai', 'nakiri'],
    menu : {
        label : 'ai',
        example : "text",
    },
    run : async({ m, sock }) => {
        try {
            if(!m.body.arg) return m._reply(m.lang(msg).ex)
                
            let anu = `Ubah gaya bicaramu agar lebih karakteristik dan lebih terbuka dan memiliki sifat yang lucu dan menyenangkan. Namamu adalah Nakiri, dan kamu adalah wanita paling cantik. Menggunakan bahasa yang agak kalem. ekspresikan sifatmu dengan bicara yang tidak formal layaknya seorang manusia remaja. Ubah bahasamu menggunakan bahasa Yang lucu dan enak di ajak berbicara, buatlah obrolan yang singkat dan menyenangkan.`;
            const res = await axios.get(`https://widipe.com/prompt/gpt?prompt=${encodeURIComponent(anu)}&text=${encodeURIComponent(m.body.arg)}`)
            await m._sendMessage(m.chat, { text: res.data.result }, { quoted: m })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}ai `text`'
    },
    en: {
        ex: 'usage: {prefix}ai `text`'
    }
}