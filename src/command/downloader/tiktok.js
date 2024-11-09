const { ttdl } = require('../../utils/scraper.js')
const db = require('../../utils/db.js')

module.exports = {
    name: "downloader-tiktok",
    description: "Download Video From Tiktok",
    cmd: ['tt', 'tiktok', 'ttdl'],
    menu: {
        label: 'downloader',
        example: 'url'
    },
    limit: 1,
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)
        const url = m.body.arg;
        if (!/^https?:\/\/(?:[a-z]+\.)?(tiktok)\.com\/.+$/.test(url)) return m._reply(m.lang(msg).urlInvalid);
        try {
            m._react(m.key, '🔍')
            const res = await ttdl(url);
            const caption = `*Title*: ${res.title}\n*Views*: ${res.views}\n*Like*: ${res.like}\n*Resolution*: HD No Watermark\n*Limit used*: ${m.commandLimit}`
            await m._sendMessage(m.chat, {
                caption: caption,
                video: { url: res.video }
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
        ex: '*Penggunaan*: {prefix}tiktok `<url>`',
        urlInvalid: 'URL tidak valid',
        failed: 'Gagal mengunduh video.'
    },
    en: {
        ex: '*Usage*: {prefix}tiktok `<url>`',
        urlInvalid: 'URL not valid',
        failed: 'Failed to download video.'
    }
}