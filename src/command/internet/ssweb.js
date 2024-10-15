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
        if(!m.body.arg) return m._reply(m.lang(msg).ex)
        
        const res = await axios.get(`https://api.screenshotmachine.com/?key=f74eca&url=${m.body.arg}&dimension=1920x1080`, { responseType: 'arraybuffer' }).catch(e => console.log(e))
        await m._sendMessage(m.chat, { image : res.data }, { quoted : m })
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}ssweb `<url>`\n\n*Keterangan:*\n- *<url>*: URL situs web yang ingin Anda ambil tangkapan layarnya.',
    },
    en: {
        ex: 'Usage: {prefix}ssweb `<url>`\n\n*Description:*\n- *<url>*: The URL of the website you want to capture a screenshot of.',
    }
}
