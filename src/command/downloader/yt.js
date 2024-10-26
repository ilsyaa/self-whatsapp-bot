const { default: axios } = require('axios');

module.exports = {
    name: "downloader-yt",
    description: "Youtube Downloader",
    cmd: ['yt', 'ytdl'],
    menu: {
        label: 'downloader',
        example: 'url'
    },
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)
        if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&\s]{11})/.test(m.body.arg)) return m._reply(m.lang(msg).urlInvalid)
        const url = m.body.arg;
    
        try {
            axios.get('https://api.nyxs.pw/dl/yt-direct?url='+ encodeURIComponent(url)).then((res) => {
                if(!res?.data?.result?.urlVideo) throw new Error(m.lang(msg).failed)
                m._sendMessage(m.chat, {    
                    video: {
                        url: res.data.result.urlVideo
                    }
                }, { quoted: m })
            })
        }catch (error) {
            m._reply(error.message)
        }

    }
}


const msg = {
    id: {
        ex: 'penggunaan: {prefix}yt `url`',
        urlInvalid: 'URL tidak valid',
        failed: 'Gagal mengunduh video.'
    },
    en: {
        ex: 'usage: {prefix}yt `url`',
        urlInvalid: 'URL not valid',
        failed: 'Failed to download video.'
    }
}