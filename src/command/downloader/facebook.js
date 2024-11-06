const { fbdl } = require('../../utils/scraper.js')
const db = require('../../utils/db.js')

module.exports = {
    name: "downloader-facebook",
    description: "Download Video From Facebook",
    cmd: ['fb', 'facebook', 'fbdl'],
    menu: {
        label: 'downloader',
        example: 'url'
    },
    limit: 5,
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)

        const url = m.body.arg;
        if (!/^https?:\/\/(?:www\.)?(facebook|fb|instagram)\.com\/.+$/.test(url)) return m._reply(m.lang(msg).urlInvalid)
        try {
            m._react(m.key, '🔍')
            const res = await fbdl(url);
            const bestQuality = res.data[0];
            const caption = `- *Resolution*: ${bestQuality.resolution}\n- *Limit used*: ${m.commandLimit}`
            await m._sendMessage(m.chat, {
                caption: caption,
                video: { url: bestQuality.url }
            }, { quoted: m })
            m._react(m.key, '✅')
            db.update(db.user, m.sender, { limit: (parseInt(m.db.user.limit) - parseInt(m.commandLimit)) });
        } catch (error) {
            m._react(m.key, '❌')
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