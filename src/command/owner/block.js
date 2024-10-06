module.exports = {
    name: "block",
    description: "Blockir Number",
    cmd: ['block'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        try {
            if(m.quoted) await sock.updateBlockStatus(m.quoted.sender, "block")
            for (let i of m?.mentionedJid || []) {
                await sock.updateBlockStatus(i, "block")
            }
            m._reply("badut berhasil diblokir.")
        } catch(error) {
            await m._reply(error.message)
        }        
    }
}