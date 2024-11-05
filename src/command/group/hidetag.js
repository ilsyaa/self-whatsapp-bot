module.exports = {
    name : "group-hidetag",
    description : "Hidetag Group",
    cmd : ['hidetag'],
    menu : {
        label : 'group',
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.body.arg) return m._reply(m.lang(msg).ex)
            let mentions = m.isGroup.groupMetadata.participants.map(v => v.id)
            await m._sendMessage(m.chat, { text: m.body.arg }, { mentions: mentions })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'penggunaan: {prefix}hidetag `text`'
    },
    en: {
        ex: 'usage: {prefix}hidetag `text`'
    }
}