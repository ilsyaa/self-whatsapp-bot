const { default: axios } = require('axios');

module.exports = {
    name: "downloader-ytmp3",
    description: "Youtube Downloader Mp3",
    cmd: ['ytmp3'],
    menu: {
        label: 'downloader'
    },
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)
        if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&\s]{11})/.test(m.body.arg)) return m._reply(m.lang(msg).urlInvalid)
        const url = m.body.arg;
    
        try {
            axios.get('https://api.nyxs.pw/dl/yt-direct?url='+ encodeURIComponent(url)).then((res) => {
                if(!res?.data?.result?.urlAudio) throw new Error(m.lang(msg).failed)
                m._sendMessage(m.chat, {    
                    audio: {
                        url: res.data.result.urlAudio
                    },
                    mimetype: 'audio/mp4'
                }, { quoted: m })
            })
        }catch (error) {
            m._reply(error.message)
        }

    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}ytmp3 `url`',
        urlInvalid: 'URL tidak valid',
        failed: 'Gagal mengunduh audio.'
    },
    en: {
        ex: 'usage: {prefix}ytmp3 `url`',
        urlInvalid: 'URL not valid',
        failed: 'Failed to download audio.'
    }
}