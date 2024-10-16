const db = require('../../utils/db.js')
const moment = require('../../utils/moment.js')

module.exports = {
    name : "bot-prefix",
    description : "Set Bot Prefix",
    cmd : ['prefix'],
    run : async({ m, sock }) => {
        try {
            if(!m.senderIsOwner) return

            // -set -remove
            let currentPrefix = m.db.bot.prefix
            let arg = m.body.arg.trim();
            const ActSet = arg.startsWith('-set');
            const ActRemove = arg.startsWith('-remove');
            if(!ActSet && !ActRemove) return m._reply(m.lang(msg).ex)
            let setPrefix = arg.replace('-set', '').replace('-remove', '').trim();
            if(!setPrefix) return m._reply(m.lang(msg).ex)
            if(setPrefix.length > 1) return m._reply(m.lang(msg).onechar)
                    
            if (ActSet) {
                if(currentPrefix.includes(setPrefix)) return m._reply(m.lang(msg).same)
                    currentPrefix.push(setPrefix)
                db.update(db.bot, 'settings', { prefix: currentPrefix, updated_at: moment() })
                await m._reply(m.lang(msg).success_set)
            } else if (ActRemove) {
                if(!currentPrefix.includes(setPrefix)) return m._reply(m.lang(msg).notFound)
                currentPrefix = currentPrefix.filter(x => x !== setPrefix)
                db.update(db.bot, 'settings', { prefix: currentPrefix, updated_at: moment() })
                await m._reply(m.lang(msg).success_remove)
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}prefix `-set <prefix>` atau `-remove`\n\n*Keterangan:*\n- *`-set <prefix>`*: Mengatur prefix baru.\n- *`-remove`*: Menghapus prefix yang ada.',
        onechar: 'Prefix hanya boleh 1 karakter.',
        same: 'Prefix sudah ada sebelumnya.',
        notFound: 'Prefix tidak ditemukan.',
        success_set: 'Prefix telah berhasil diatur.',
        success_remove: 'Prefix telah berhasil dihapus.'
    },
    en: {
        ex: 'Usage: {prefix}prefix `-set <prefix>` or `-remove`\n\n*Description:*\n- *`-set <prefix>`*: Sets a new prefix.\n- *`-remove`*: Removes the existing prefix.',
        onechar: 'Prefix must be 1 character only.',
        same: 'Prefix already exists.',
        notFound: 'Prefix not found.',
        success_set: 'Prefix has been successfully set.',
        success_remove: 'Prefix has been successfully removed.'
    }
}
