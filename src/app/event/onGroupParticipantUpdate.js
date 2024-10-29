const db = require('../../utils/db.js');

module.exports = groupParticipant = async (sock) => {
    sock.ev.on('group-participants.update', async (update) => {
        switch (update.action) {
            case 'add':
                await _welcome(sock, update)
                break
            case 'remove':
                break
        }
    })
}

const _welcome = async (sock, update) => {
    const dbgroup = await db.group.get(update.id)
    const featchGroup = await sock.groupMetadata(update.id) || (sock.chats[id] || {}).metadata
    if(!dbgroup) return
    if(!dbgroup.welcome) return
    for (const participant of update.participants) {
        let avatar = "https://i.ibb.co.com/1QRWZTd/146de169d3133554a6d907b837d31377.jpg";
        const mention = '@'+participant.replace('@s.whatsapp.net', '');
        let caption = `Selamat datang @${participant.replace('@s.whatsapp.net', '')} 👋`
        try{
            avatar = await sock.profilePictureUrl(participant, 'image');
        } catch {
        } finally {
            try {
                sock.sendMessage(update.id, {
                    text: dbgroup?.welcome_message ? dbgroup.welcome_message.replace(/{group\.name}/g, dbgroup.name).replace(/{mention}/g, mention) : caption,
                    contextInfo: {
                        mentionedJid: [ participant ],
                        externalAdReply: {
                            title: `❖ ${dbgroup.name}`,
                            body: `▷ ${featchGroup.size} member`,
                            thumbnailUrl: avatar,
                            sourceUrl: 'https://ilsya.my.id',
                            mediaType: 1,
                            // renderLargerThumbnail: true
                        }
                    }
                }, { ephemeralExpiration: true })
            } catch (error) {
                console.error(error);
            }   
        }
    }
}