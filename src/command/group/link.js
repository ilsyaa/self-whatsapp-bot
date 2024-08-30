module.exports = {
    name : "group-link",
    description : "Get Link Group",
    cmd : ['gclink'],
    menu : {
        label : 'group'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            const link = `https://chat.whatsapp.com/${await sock.groupInviteCode(m.chat)}`
            await m._reply(link)
        } catch(error) {
            await m._reply(error.message)
        }
    }
}