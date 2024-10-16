const db = require('../../utils/db.js')
const moment = require('../../utils/moment.js')

module.exports = {
    name : "bot-owner",
    description : "Set Bot Owner",
    cmd : ['owner'],
    run : async({ m, sock }) => {
        try {
            if(!m.senderIsOwner) return

            // -set -remove
            let currentOwner = m.db.bot.owners
            let arg = m.body.arg.trim();
            const ActSet = arg.startsWith('-set');
            const ActRemove = arg.startsWith('-remove');
            if(!ActSet && !ActRemove) return m._reply(m.lang(msg).ex)
            let setOwner = arg.replace('-set', '').replace('-remove', '').trim();
            if(!setOwner) return m._reply(m.lang(msg).ex)
            const [ number, name ] = setOwner.split('|')
            if(!number && !name) return m._reply(m.lang(msg).ex)
            let hashOwner = Object.keys(currentOwner).find(x => x == number)
            
            if (ActSet) {
                if(hashOwner) return m._reply(m.lang(msg).same)
                setOwner = { [number]: name }
                currentOwner = { ...currentOwner, ...setOwner }
                db.update(db.bot, 'settings', { owners: currentOwner, updated_at: moment() })
                await m._reply(m.lang(msg).success_set)
            } else if (ActRemove) {
                if(!hashOwner) return m._reply(m.lang(msg).notFound)
                delete currentOwner[hashOwner]
                db.update(db.bot, 'settings', { owners: currentOwner, updated_at: moment() })
                await m._reply(m.lang(msg).success_remove)
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}owner `-set <number|name>` atau `-remove`\n\n*Keterangan:*\n- *-set <number|name>*: Mengatur owner baru. Gunakan nomor dengan kode negara, misalnya 62 untuk Indonesia, dan nama.\n- *-remove <number>*: Menghapus owner yang ada.',
        same: 'Nomor tersebut sudah menjadi owner sebelumnya.',
        notFound: 'Nomor tidak ditemukan.',
        success_set: 'Owner telah berhasil ditambahkan.',
        success_remove: 'Owner telah berhasil dihapus.'
    },
    en: {
        ex: 'Usage: {prefix}owner `-set <number|name>` or `-remove`\n\n*Description:*\n- *-set <number|name>*: Set a new owner. Use a number with country code, e.g., 62 for Indonesia, and name.\n- *-remove <number>*: Remove the existing owner.',
        same: 'The number is already an owner.',
        notFound: 'Number not found.',
        success_set: 'Owner has been successfully added.',
        success_remove: 'Owner has been successfully removed.'
    }
}
