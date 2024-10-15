module.exports = {
    name: "join",
    description: "Join group by link",
    cmd: ['join'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return
        if(!m.body.arg) return m._reply(m.lang(msg).ex)
        try {
            const codelink = m.body.arg.replace('https://chat.whatsapp.com/', '')
            const info = await sock.groupGetInviteInfo(codelink)
            await sock.groupAcceptInvite(codelink)
            await m._reply(`${m.lang(msg).success} ${info.subject}!`)
        } catch(error) {
            console.log(error);
            await m._reply(m.lang(msg).error)
        }        
    }
}

const msg = {
    id: {
        ex: 'Cara penggunaan: {prefix}join `<link>`\n\n*Keterangan:*\n- *<link>*: Tautan undangan grup yang ingin Anda masuki.',
        success: 'Berhasil masuk ke grup',
        error: 'Link grup tidak valid!'
    },
    en: {
        ex: 'Usage: {prefix}join `<link>`\n\n*Description:*\n- *<link>*: The invitation link of the group you want to join.',
        success: 'Successfully joined the group',
        error: 'Invalid group link!'
    }
}
