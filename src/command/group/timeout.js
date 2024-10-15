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
            if(!m.body.arg) return m._reply(m.lang(msg).ex)
            if(!m.mentionedJid.length) return m._reply(m.lang(msg).noMention)
            const durationInMinutes = m.body.arg.split(' ')[0]
            if(isNaN(durationInMinutes)) return m._reply(m.lang(msg).noDuration)
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

            if(durationInMinutes == 0) return m._reply(`${m.mentionedJid.length} ${m.lang(msg).zero}`)
            await m._reply(`${m.mentionedJid.length} ${m.lang(msg).success[0]} ${durationInMinutes} ${m.lang(msg).success[1]}`)
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}timeout `<durasi>` `@mentions`\n\n*Keterangan:*\n- *durasi*: Waktu yang diberikan kepada member yang di-mention dalam satuan menit.\n- *@mentions*: Sebut anggota yang ingin dikenakan timeout.',
        noMention: 'Tidak ada member yang di-mention. Silakan sebut anggota yang ingin dikenakan timeout.',
        noDuration: 'Durasi waktu harus berupa angka yang menunjukkan menit.',
        success: ['Member telah di timeout selama', 'menit.'],
        zero: 'member telah di nyatakan sehat.'
    },
    en: {
        ex: 'Usage: {prefix}timeout `<duration>` `@mentions`\n\n*Description:*\n- *duration*: The time to give to the mentioned members in minutes.\n- *@mentions*: Mention the members you want to apply the timeout to.',
        noMention: 'No member mentioned. Please mention the members to apply timeout.',
        noDuration: 'Duration must be a number indicating minutes.',
        success: ['Members have been timed out for', 'minutes.'],
        zero: 'Members have been declared healthy.'
    }
}
