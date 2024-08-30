module.exports = {
    name : "group-add",
    description : "Add Participant From Group",
    cmd : ['add'],
    menu : {
        label : 'group'
    },
    run : async({ m, sock }) => {
        // try {
        //     if(!m.isGroup) return
        //     if(!m.isGroup.botIsAdmin) return
        //     if(!m.isGroup.senderIsAdmin) return
        //     if(!m.body.arg) return m._reply("penggunaan: add <@tag>")

        //     await sock.groupParticipantsUpdate(m.chat, [m.body.arg + "@s.whatsapp.net"], "add")
        // } catch(error) {
        //     await m._reply(error.message)
        // }
    }
}