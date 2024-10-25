const { ttdl } = require('../../utils/scraper.js')

module.exports = {
    name: "downloader-tiktok",
    description: "Download Video From Tiktok",
    cmd: ['tt', 'tiktok', 'ttdl'],
    menu: {
        label: 'downloader'
    },
    run: async ({ m, sock }) => {
        if (!m.body.arg) return m._reply(m.lang(msg).ex)
        const url = m.body.arg;
        if (!/^https?:\/\/(?:[a-z]+\.)?(tiktok)\.com\/.+$/.test(url)) return m._reply(m.lang(msg).urlInvalid);
        try {
            const res = await ttdl(url);
            const caption = `*Title*: ${res.title}\n*Views*: ${res.views}\n*Like*: ${res.like}\n*Resolution*: HD No Watermark`
            m._sendMessage(m.chat, {
                caption: caption,
                video: { url: res.video }
            }, { quoted: m })
        } catch (error) {
            console.log(error);
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