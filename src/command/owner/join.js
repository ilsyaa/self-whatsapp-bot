module.exports = {
    name: "join",
    description: "Join group by link",
    cmd: ['join'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.body.arg) return m._reply("Cara penggunaan: join <link>")
        try {
            const codelink = m.body.arg.replace('https://chat.whatsapp.com/', '')
            const info = await sock.groupGetInviteInfo(codelink)
            await sock.groupAcceptInvite(codelink)
            await m._reply(`Berhasil masuk group ${info.subject}!`)
        } catch(error) {
            console.log(error);
            await m._reply('Link group tidak valid!')
        }        
    }
}