const db = require('../../utils/db.js')
const moment = require('../../utils/moment.js')

module.exports = {
    name : "group-timeout",
    description : "Timeout member nakal",
    cmd : ['timeout', 'to', 'bungkam'],
    menu : {
        label : 'group',
        example : '_<duration> @mentions_'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.body.arg) return m._reply("*Cara penggunaan*: "+m.body.prefix+"timeout `<duration>` `@mentions`\n*Contoh*: "+m.body.prefix+"timeout 10 @user1 @user2\n_Duration in minutes_")
            if(!m.mentionedJid.length) return m._reply("Tidak ada member yang di mention.")
            const durationInMinutes = m.body.arg.split(' ')[0]
            if(isNaN(durationInMinutes)) return m._reply("Durasi waktu harus berupa angka.")
            const timeoutEnd = moment().add(durationInMinutes, 'minutes').valueOf()
            const users = {};
            for(mention of m.mentionedJid) {
                users[mention] = timeoutEnd
            }

            await db.update(
                db.group, 
                m.isGroup.groupMetadata.id, 
                { 
                    timeouts: {
                        ...db.group.get(m.isGroup.groupMetadata.id).timeouts || {},
                        ...users
                    }
                }
            )

            if(durationInMinutes == 0) return m._reply(`${m.mentionedJid.length} member telah di nyatakan sehat.`)
            await m._reply(`${m.mentionedJid.length} member di timeout selama ${durationInMinutes} menit.`)
        } catch(error) {
            await m._reply(error.message)
        }
    }
}