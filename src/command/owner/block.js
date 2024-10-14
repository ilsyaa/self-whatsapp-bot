module.exports = {
    name: "block",
    description: "Blockir Number",
    cmd: ['block'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.mentionedJid.length && !m.quoted) return m._reply("Mention atau reply pesan badut yang ingin diblokir.")

        try {
            if(m.quoted) await sock.updateBlockStatus(m.quoted.sender, "block")
            for (let i of m?.mentionedJid || []) {
                await sock.updateBlockStatus(i, "block")
            }
            m._reply(`${m.mentionedJid.length} badut berhasil diblokir.`)
        } catch(error) {
            await m._reply(error.message)
        }        
    }
}