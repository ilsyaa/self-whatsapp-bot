const db = require('../../utils/db.js')

module.exports = {
    name : "group-timeout",
    description : "Timeout member nakal",
    cmd : ['timeout', 'to'],
    menu : {
        label : 'timeout',
    },
    run : async({ m, sock }) => {
        // try {
        //     // if(!m.isGroup) return
        //     // if(!m.isGroup.botIsAdmin) return
        //     // if(!m.isGroup.senderIsAdmin) return
        //     if(!m.body.arg) return m._reply("penggunaan: timeout `@user` 1")
            
        //     if(m.body.arg.split(' ')[1] == '1') {
        //         await db.update(db.group, m.isGroup.groupMetadata.id, { timeout: true })
        //     } else {

        //     }
        // } catch(error) {
        //     await m._reply(error.message)
        // }
    }
}