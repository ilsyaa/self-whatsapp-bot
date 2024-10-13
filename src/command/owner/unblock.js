module.exports = {
    name: "unblock",
    description: "UnBlockir Number",
    cmd: ['unblock'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(m.mentionedJid && m.mentionedJid.length == 0) return m._reply("@mentions orang yang ingin di unblokir.")

        try {
            if(m.quoted) await sock.updateBlockStatus(m.quoted.sender, "unblock")
            for (let i of m?.mentionedJid || []) {
                await sock.updateBlockStatus(i, "unblock")
            }
            m._reply(`${m.mentionedJid.length} badut berhasil diunblokir.`)
        } catch(error) {
            await m._reply(error.message)
        }        
    }
}