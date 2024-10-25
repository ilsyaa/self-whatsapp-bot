const { default: axios } = require('axios')
const {
    S_WHATSAPP_NET
} = require('@whiskeysockets/baileys')
const jimp_1 = require('jimp')

module.exports = {
    name: "setpp",
    description: "Set Profile Bot",
    cmd: ['setpp'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.body.arg && !['imageMessage'].includes(m.quoted?.mtype || m.mtype)) return m._reply(m.lang(msg).ex)

        try {
            let media;
            if (m.body.arg) {
                let { data } = await axios.get(m.body.arg, { responseType: 'arraybuffer' })
                media = data
            }
            if (m.quoted) {
                let { buffer } = await m.quoted.download()
                media = buffer
            }
            if (!media) {
                let { buffer } = await m.download()
                media = buffer
            }

            let { img } = await pepe(media)

            await sock.query({
                tag: 'iq',
                attrs: {
                   to: S_WHATSAPP_NET,
                   type: 'set',
                   xmlns: 'w:profile:picture'
                },
                content: [
					{
						tag: 'picture',
						attrs: { type: 'image' },
						content: img
					}
				]
             })

             m._reply(m.lang(msg).success)
        } catch(error) {
            await m._reply(error.message)
        }        
    }
}

async function pepe(media) {
	const jimp = await jimp_1.read(media)
	const min = jimp.getWidth()
	const max = jimp.getHeight()
	const cropped = jimp.crop(0, 0, min, max)
	return {
		img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp_1.MIME_JPEG),
		preview: await cropped.normalize().getBufferAsync(jimp_1.MIME_JPEG)
	}
}

const msg = {
    id: {
        ex: 'Balas atau kirim url gambar untuk di jadikan profile.',
        success: 'Profile telah berhasil diubah.'
    },
    en: {
        ex: 'Reply to an image or send an image with the caption `{prefix}setpp`.',
        success: 'Profile has been successfully changed.'
    }
}
