module.exports = {
    name : "group-add",
    description : "Add Participant From Group",
    cmd : ['add'],
    menu : {
        label : 'group',
        example : '_<number>_'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.body.arg) return m._reply("penggunaan: "+m.body.prefix+"add `<number>`")
            let number = m.body.arg
            await sock.groupParticipantsUpdate(m.chat, [`${number}@s.whatsapp.net`], "add")
        } catch(error) {
            await m._reply(error.message)
        }
    }
}