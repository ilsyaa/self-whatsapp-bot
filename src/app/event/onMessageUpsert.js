const { serialize, updateAdminStatus, isMedia } = require('../../utils/serialize.js');
const log = require('../../utils/log.js');
const { commands } = require('../../utils/loadCommands.js')

module.exports = upsert = async (sock) => {
    sock.ev.on('messages.upsert', async (update) => {
        try {
            const { messages, type } = update
            let m = messages[0]
            if (m.message?.ephemeralMessage) m.message = m.message.ephemeralMessage.message;
            if (m.message?.viewOnceMessageV2) m.message = m.message.viewOnceMessageV2.message;
            if (m.message?.viewOnceMessageV2Extension) m.message = m.message.viewOnceMessageV2Extension.message;
            if (m.message?.documentWithCaptionMessage) m.message = m.message.documentWithCaptionMessage.message;
            if (!m.message) return
            if (m.key && m.key.remoteJid == "status@broadcast") return
            if (!m.key.fromMe && !type === 'notify') return
            if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
            m = serialize(sock, m)
            await updateAdminStatus(sock, m);

            await _antilink(sock, m)
            
            if(!sock.public) {
                if (!m.fromMe) {
                    if(!m.senderIsOwner) return
                }
            }

            const command = Array.from(commands.values()).find((v) => v.cmd.find((x) => x.toLowerCase() == m.body.first.toLowerCase()));
            if(!command) return
            await command.run({m , sock})
        } catch (error) {
            log.error("onMessageUpsert :" + error.message);
        }    
    })
}

const _antilink = async (sock, m) => {
    if(m.fromMe) return
    if(!m.isGroup) return
    if(!m.isGroup.botIsAdmin) return
    if(m.isGroup.senderIsAdmin) return
    if(!m.body.full.match(`chat.whatsapp.com`)) return
    const currentGroupLink = (`https://chat.whatsapp.com/` + await sock.groupInviteCode(m.chat))
    if(m.body.full.match(currentGroupLink)) return
    await sock.sendMessage(m.chat, { delete: m.key })
}   