module.exports = {
    name : "group-del-message",
    description : "Delete message from group",
    cmd : ['del', 'delete'],
    menu : {
        label : 'group',
        example : '`reply`'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.quoted) return m._reply('reply to a message')
            m.quoted.delete()
        } catch(error) {
            await m._reply(error.message)
        }
    }
}