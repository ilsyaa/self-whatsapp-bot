module.exports = {
    name: "leave",
    description: "Leave bot from Group",
    cmd: ['leave'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        try {
            m._sendMessage(m.chat, { text: 'bye.' })
            setTimeout(async() => {
                await sock.groupLeave(m.chat)
            }, 1000);
        } catch(error) {
            await m._reply(error.message)
        }        
    }
}