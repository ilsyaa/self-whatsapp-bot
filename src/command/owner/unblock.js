module.exports = {
    name: "unblock",
    description: "UnBlockir Number",
    cmd: ['unblock'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.mentionedJid.length && !m.quoted) return m._reply(m.lang(msg).ex)

        try {
            if(m.quoted) await sock.updateBlockStatus(m.quoted.sender, "unblock")
            for (let i of m?.mentionedJid || []) {
                await sock.updateBlockStatus(i, "unblock")
            }
            m._reply(`${m.mentionedJid.length} ${m.lang(msg).success}`)
        } catch(error) {
            await m._reply(error.message)
        }        
    }
}

const msg = {
    id: {
        ex: 'Sebut (mention) atau balas pesan orang yang ingin di-unblockir.',
        success: 'orang telah berhasil di-unblockir.',
    },
    en: {
        ex: 'Mention or reply to the message of the person you want to unblock.',
        success: 'person has been successfully unblocked.'
    }
}
