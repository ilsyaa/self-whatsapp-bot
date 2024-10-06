const { default: axios } = require("axios");

module.exports = {
    name : "ssweb",
    description : "Screenshot Website",
    cmd : ['ssweb'],
    menu : {
        label : 'internet',
        example : '_<url>_'
    },
    run : async({ m, sock }) => {
        if(!m.body.arg) return m._reply("Cara penggunaan: ssweb <url>")
        
        const res = await axios.get(`https://api.screenshotmachine.com/?key=f74eca&url=${m.body.arg}&dimension=1920x1080`, { responseType: 'arraybuffer' }).catch(e => console.log(e))
        await m._sendMessage(m.chat, { image : res.data }, { quoted : m })
    }
}