module.exports = {
    name: "block",
    description: "Blockir Number",
    cmd: ['block'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.mentionedJid.length && !m.quoted) return m._reply(m.lang(msg).ex)

        try {
            if(m.quoted) await sock.updateBlockStatus(m.quoted.sender, "block")
            for (let i of m?.mentionedJid || []) {
                await sock.updateBlockStatus(i, "block")
            }
            m._reply(`${m.mentionedJid.length} ${m.lang(msg).success}`)
        } catch(error) {
            await m._reply(error.message)
        }        
    }
}

const msg = {
    id: {
        ex: 'Sebut (mention) atau balas pesan badut yang ingin diblokir.',
        success: 'Badut telah berhasil diblokir.'
    },
    en: {
        ex: 'Mention or reply to the bad guy you want to block.',
        success: 'Bad guy has been successfully blocked.'
    }
}
