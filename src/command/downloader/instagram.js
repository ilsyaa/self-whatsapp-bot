const { fbdl } = require('../../utils/scraper.js')

module.exports = {
    name: "downloader-instagram",
    description: "Download Video From Instagram",
    cmd: ['ig', 'instagram', 'igdl'],
    menu: {
        label: 'downloader',
        example: 'url'
    },
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)

        const url = m.body.arg;
        if (!/^https?:\/\/(?:www\.)?(facebook|fb|instagram)\.com\/.+$/.test(url)) return m._reply(m.lang(msg).urlInvalid)
            try {
            m._react(m.key, '🔍')
            const res = await fbdl(url);
            const bestQuality = res.data[0];
            await m._sendMessage(m.chat, {
                video: { url: bestQuality.url }
            }, { quoted: m })
            m._react(m.key, '✅')
        } catch (error) {
            m._react(m.key, '❌')
            m._reply(m.lang(msg).failed)
        }
    }
}

const msg = {
    id: {
        ex: '*Penggunaan*: {prefix}ig `<url>`',
        urlInvalid: 'URL tidak valid',
        failed: 'Gagal mengunduh video.'
    },
    en: {
        ex: '*Usage*: {prefix}ig `<url>`',
        urlInvalid: 'URL not valid',
        failed: 'Failed to download video.'
    }
}