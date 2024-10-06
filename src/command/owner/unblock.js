module.exports = {
    name: "unblock",
    description: "UnBlockir Number",
    cmd: ['unblock'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        try {
            if(m.quoted) await sock.updateBlockStatus(m.quoted.sender, "unblock")
            for (let i of m?.mentionedJid || []) {
                await sock.updateBlockStatus(i, "unblock")
            }
            m._reply("badut berhasil diunblokir.")
        } catch(error) {
            await m._reply(error.message)
        }        
    }
}