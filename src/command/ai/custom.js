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
        m._reply('Kamu bisa langsung ngobrol dengan Nakiri! Di dalam grup, cukup mention nakiri, balas pesan dari Nakiri, atau kirim pertanyaan sambil menyebut namanya. Kalau di personal chat, langsung aja kirim chat nanti langsung di balas.')
    }
}