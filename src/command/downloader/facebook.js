const { fbdl } = require('../../utils/scraper.js')

module.exports = {
    name: "downloader-facebook",
    description: "Download Video From Facebook",
    cmd: ['fb', 'facebook', 'fbdl'],
    menu: {
        label: 'downloader',
        example: 'url'
    },
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)

        const url = m.body.arg;
        if (!/^https?:\/\/(?:www\.)?(facebook|fb|instagram)\.com\/.+$/.test(url)) return m._reply(m.lang(msg).urlInvalid)
        try {
            const res = await fbdl(url);
            const bestQuality = res.data[0];
            const caption = `*Resolution*: ${bestQuality.resolution}`
            m._sendMessage(m.chat, {
                caption: caption,
                video: { url: bestQuality.url }
            }, { quoted: m })
        } catch (error) {
            m._reply(m.lang(msg).failed)
        }
    }
}

const msg = {
    id: {
        ex: '*Penggunaan*: {prefix}fb `<url>`',
        urlInvalid: 'URL tidak valid',
        failed: 'Gagal mengunduh video.'
    },
    en: {
        ex: '*Usage*: {prefix}fb `<url>`',
        urlInvalid: 'URL not valid',
        failed: 'Failed to download video.'
    }
}