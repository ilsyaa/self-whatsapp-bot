module.exports = {
    name: "block",
    description: "Blockir Number",
    cmd: ['block'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(m.mentionedJid && m.mentionedJid.length == 0) return m._reply("@mentions orang yang ingin diblokir.")

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