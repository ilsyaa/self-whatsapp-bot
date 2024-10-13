const db = require('../../utils/db.js')

module.exports = {
    name: "mode-bot",
    description: "Fitur mengganti mode bot dari public ke private dan sebaliknya",
    cmd: ['mode'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.body.arg) return m._reply("penggunaan: mode <public/private>")
        
        if(m.body.arg == 'public' || m.body.arg == 'pb') {
            await db.bot.put('settings', { mode: 'public' })
            await m._reply('`bot mode public`')
        } else if(m.body.arg == 'private' || m.body.arg == 'pv') {
            await db.bot.put('settings', { mode: 'private' })
            await m._reply('`bot mode private`')
        } else {
            await m._reply("penggunaan: mode <public/private>")
        }
    }
}