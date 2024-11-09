const { default: axios } = require('axios');
const db = require('../../utils/db.js');

module.exports = {
    name: "downloader-ytmp3",
    description: "Youtube Downloader Mp3",
    cmd: ['ytmp3', 'play'],
    menu: {
        label: 'downloader',
        example: 'url'
    },
    limit: 1,
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)
        if (!/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&\s]{11})/.test(m.body.arg)) return m._reply(m.lang(msg).urlInvalid)
        const url = m.body.arg;
    
        try {
            m._react(m.key, '🔍')
            axios.get('https://api.nyxs.pw/dl/yt-direct?url='+ encodeURIComponent(url)).then(async(res) => {
                if(!res?.data?.result?.urlAudio) return m._reply(m.lang(msg).failed)
                await m._sendMessage(m.chat, {    
                    audio: {
                        url: res.data.result.urlAudio
                    },
                    mimetype: 'audio/mp4'
                }, { quoted: m })
                db.update(db.user, m.sender, { limit: (parseInt(m.db.user.limit) - parseInt(m.commandLimit)) });
                m._react(m.key, '✅')
            }).catch((error) => {
                m._react(m.key, '❌')
                m._reply(m.lang(msg).failed)
            })
        }catch (error) {
            m._react(m.key, '❌')
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