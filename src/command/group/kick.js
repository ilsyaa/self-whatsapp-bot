module.exports = {
    name : "group-kick",
    description : "Kick Participant From Group",
    cmd : ['kick'],
    menu : {
        label : 'group',
        example : 'reply or mention'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.quoted && !m.mentionedJid.length) return m._reply(m.lang(msg).ex)

            if(m.quoted) await sock.groupParticipantsUpdate(m.chat, [m.quoted.sender], "remove")
            for (let i of m?.mentionedJid || []) {
                await sock.groupParticipantsUpdate(m.chat, [i], "remove")
            }
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan:\n\n1. *Balas Pesan*: Balas pesan anggota yang ingin di-kick dengan perintah ini.\n2. **Sebut Anggota**: Sebut (mention) anggota yang ingin di-kick dengan perintah ini.',
    },
    en: {
        ex: 'Usage:\n\n1. *Reply to Message*: Reply to the message of the member you want to kick with this command.\n2. **Mention Member**: Mention the member you want to kick with this command.',
    }
}
