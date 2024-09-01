const { default: axios } = require("axios")

module.exports = {
    name : "llama3",
    description : "AI Llama3",
    cmd : ['llm', 'llama3'],
    menu : {
        label : 'ai',
        example : "_<query>_",
    },
    run : async({ m, sock }) => {
        try {
            if(!m.body.arg) return m._reply("penggunaan: llm <teks>")
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
        } catch(error) {
            await m._reply(error.message)
        }
    }
}