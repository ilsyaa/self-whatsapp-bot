const db = require('../../utils/db.js')
const moment = require('../../utils/moment.js')

module.exports = {
    name : "bot-exif",
    description : "Set Bot Exif",
    cmd : ['exif'],
    run : async({ m, sock }) => {
        try {
            if(!m.senderIsOwner) return
            
            let [pack, author] = m.body.arg.trim().split('|')
            if(!pack && !author) return m._reply(m.lang(msg).ex)
            db.update(db.bot, 'settings', { exif: { pack, author }, updated_at: moment() })
            await m._reply(m.lang(msg).success)
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}exif `<pack|author>`\n\n**Keterangan:**\n- **`<pack>`**: Nama paket yang akan digunakan untuk exif.\n- **`<author>`**: Nama penulis yang akan digunakan untuk exif.',
        success: 'Exif telah berhasil diatur.'
    },
    en: {
        ex: 'Usage: {prefix}exif `<pack|author>`\n\n**Description:**\n- **`<pack>`**: The pack name to be used for exif.\n- **`<author>`**: The author name to be used for exif.',
        success: 'Exif has been successfully set.'
    }
}