module.exports = {
    name : "group-del-message",
    description : "Delete message from group",
    cmd : ['del', 'delete'],
    menu : {
        label : 'group',
        example : 'reply'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.quoted) return m._reply(m.lang(msg).ex)
            // hapus pesan yang di reply
            await sock.sendMessage(m.chat, { delete: m.quoted.key })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'reply message yang ingin di hapus'
    },
    en: {
        ex: 'reply message you want to delete'
    }
}