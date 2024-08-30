module.exports = {
    name : "group-kick",
    description : "Kick Participant From Group",
    cmd : ['kick'],
    menu : {
        label : 'group'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return

            if(m.quoted) await sock.groupParticipantsUpdate(m.chat, [m.quoted.sender], "remove")
            for (let i of m?.mentionedJid || []) {
                await sock.groupParticipantsUpdate(m.chat, [i], "remove")
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}