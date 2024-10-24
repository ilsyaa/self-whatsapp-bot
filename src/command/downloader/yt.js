const { default: axios } = require('axios');
const mime = require('mime-types');

module.exports = {
    name: "downloader-ytmp3",
    description: "Youtube Downloader Mp3",
    cmd: ['ytmp3'],
    menu: {
        label: 'downloader'
    },
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)
        const url = m.body.arg;
    
        try {
            axios.get('https://api.nyxs.pw/dl/yt-direct?url='+ encodeURIComponent(url)).then((res) => {
                m._sendMessage(m.chat, {
                    audio: {
                        url: res.data.result.urlAudio
                    },
                }, { quoted: m })
            })
        }catch (error) {
            m._reply(error.message)
        }

    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}yts `judul`',
    },
    en: {
        ex: 'usage: {prefix}yts `title`',
    }
}