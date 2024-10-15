const db = require('../../utils/db.js')

module.exports = {
    name: "mode-bot",
    description: "Fitur mengganti mode bot dari public ke private dan sebaliknya",
    cmd: ['mode'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.body.arg) return m._reply(m.lang(msg).ex)
        
        if(m.body.arg == 'public' || m.body.arg == 'pb') {
            await db.bot.put('settings', { mode: 'public' })
            await m._reply(m.lang(msg).public)
        } else if(m.body.arg == 'private' || m.body.arg == 'pv') {
            await db.bot.put('settings', { mode: 'private' })
            await m._reply(m.lang(msg).private)
        } else {
            await m._reply(m.lang(msg).ex)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}mode `<public/private>`\n\n*Keterangan:*\n- *public*: Mengatur bot dalam mode publik.\n- *private*: Mengatur bot dalam mode pribadi.',
        public: 'Bot telah diatur ke mode publik.',
        private: 'Bot telah diatur ke mode pribadi.'
    },
    en: {
        ex: 'Usage: {prefix}mode `<public/private>`\n\n*Description:*\n- *public*: Sets the bot to public mode.\n- *private*: Sets the bot to private mode.',
        public: 'Bot has been set to public mode.',
        private: 'Bot has been set to private mode.'
    }
}
