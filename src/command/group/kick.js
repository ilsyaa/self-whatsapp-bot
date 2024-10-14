module.exports = {
    name : "group-kick",
    description : "Kick Participant From Group",
    cmd : ['kick'],
    menu : {
        label : 'group',
        example : '`reply or mention`'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.quoted && !m.mentionedJid.length) return m._reply('Ada dua cara penggunaan yaitu reply pesan atau mention member yang ingin di kick.')

            if(m.quoted) await sock.groupParticipantsUpdate(m.chat, [m.quoted.sender], "remove")
            for (let i of m?.mentionedJid || []) {
                await sock.groupParticipantsUpdate(m.chat, [i], "remove")
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}