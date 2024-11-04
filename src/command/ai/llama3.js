const { default: axios } = require("axios")

module.exports = {
    name : "llama3",
    description : "AI Llama3",
    cmd : ['llm', 'llama3'],
    menu : {
        label : 'ai',
        example : "text",
    },
    run : async({ m, sock }) => {
        try {
            if(!m.body.arg) return m._reply(m.lang(msg).ex)
            m._react(m.key, '🔍')
            let json = {
                model: "meta-llama/Meta-Llama-3.1-405B-Instruct",
                messages: [
                    {
                        role: "system",
                        content: "Be a helpful assistant",
                    },
                    {
                        role: "user",
                        content: m.body.arg,
                    },
                ],
                presence_penalty: 0.1,
                frequency_penalty: 0.1,
                top_k: 100,
            };
            const { data } = await axios.post(
                "https://imphnen-ai.vercel.app/api/llm/llama",
                json,
            );
            await m._sendMessage(m.chat, { text: `*• Model :* ${data.data.model}\n` + data.data.choices[0].message.content }, { quoted: m })
            m._react(m.key, '✅')
        } catch(error) {
            m._react(m.key, '❌')
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}llm `text`'
    },
    en: {
        ex: 'usage: {prefix}llm `text`'
    }
}