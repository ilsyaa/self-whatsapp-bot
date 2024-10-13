const { serialize, updateAdminStatus, isMedia } = require('../../utils/serialize.js');
const log = require('../../utils/log.js');
const { commands } = require('../../utils/loadCommands.js')
const config = require('../../../config.js');
const db = require('../../utils/db.js')

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
            // read message
            await sock.readMessages([m.key])
            await updateAdminStatus(sock, m);
            const dbGroupData = await _dbGroupHandler(sock, m)
            m.db = {
                user: null,
                group: dbGroupData,
                bot: db.bot.get('settings'),
            }
            await _timeout(sock, m)
            await _antilink(sock, m)
            if(!m.senderIsOwner && m.db.bot.mode == 'private') return
            if (m.isGroup && !m.senderIsOwner && m.db.group.mode === 'admin-only' && !m.isGroup.senderIsAdmin) return
            const command = Array.from(commands.values()).find((v) => v.cmd.find((x) => x.toLowerCase() == m.body.commandWithoutPrefix.toLowerCase()));
            if(!command) return
            if(!command?.withoutPrefix && !m.body.prefix) return
            m.db.user = await _autoRegisterUser(sock, m)
            await command.run({m , sock})
            console.log(m);
        } catch (error) {
            log.error("onMessageUpsert :" + error.message);
        }    
    })
}

const _timeout = async (sock, m) => {
    if(m.fromMe) return
    if(!m.isGroup) return
    if(!m.db?.group?.timeouts) return
    if(!m.isGroup.botIsAdmin) return
    if(m.isGroup.senderIsAdmin) return

    if(m.db.group.timeouts.include(m.sender)) {
        await sock.sendMessage(m.chat, { delete: m.key })
    }
}

const _antilink = async (sock, m) => {
    if(m.fromMe) return
    if(!m.isGroup) return
    if(!m.db?.group?.antilink) return
    if(!m.isGroup.botIsAdmin) return
    if(m.isGroup.senderIsAdmin) return
    if(!m.body.full.match(`chat.whatsapp.com`)) return
    const currentGroupLink = (`https://chat.whatsapp.com/` + await sock.groupInviteCode(m.chat))
    if(m.body.full.match(currentGroupLink)) return
    await sock.sendMessage(m.chat, { delete: m.key })
}

const _autoRegisterUser = async (sock, m) => {
    let dbUserData = null;
    dbUserData = await db.user.get(m.sender)
    if(!dbUserData) {
        await db.user.put(m.sender, {
            ...config.USER_DEFAULT,
            blacklist: false, // false = not in blacklist, true = in blacklist permanently, timestamp = in blacklist for some time
            blacklist_reason: '', // reason for blacklist
            updated_at: Date.now(), // update every time using bot
            created_at: Date.now(),
        })
        dbUserData = await db.user.get(m.sender)
    }
    return dbUserData
}

const _dbGroupHandler = async (sock, m) => {
    let dbGroupData = null;
    if(m.isGroup) {
        const group = m.isGroup.groupMetadata
        dbGroupData = await db.group.get(group.id)
        if(!dbGroupData) {
            await db.group.put(group.id, {
                name: group.subject,
                mode: 'admin-only', // admin-only or all
                antilink: false,
                welcome: false,
                welcome_message: null,
                welcome_background: null,
                timeouts: [],
            })
            dbGroupData = await db.group.get(group.id)
        }
    }
    return dbGroupData
}