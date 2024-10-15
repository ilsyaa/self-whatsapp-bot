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
        let res = null
        try {
            try {
                res = await axios.get(`https://api.screenshotmachine.com/?key=f74eca&url=${m.body.arg}&dimension=1920x1080`, { responseType: 'arraybuffer' })
            } catch {
                try {
                    res = await axios.get(`https://image.thum.io/get/fullpage/${m.body.arg}`, { responseType: 'arraybuffer' })
                } catch {
                    res = await axios.get(`https://api.screenshotmachine.com/?key=c04d3a&url=${m.body.arg}&screenshotmachine.com&dimension=720x720`, { responseType: 'arraybuffer' })
                }
            }
            await m._sendMessage(m.chat, { image : res.data }, { quoted : m })
        } catch (error) {
            await m._reply(error.message)
        }
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
