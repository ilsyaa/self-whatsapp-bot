const { serialize, updateAdminStatus, isMedia } = require('../../utils/serialize.js');
const log = require('../../utils/log.js');
const { commands } = require('../../utils/loadCommands.js')
const config = require('../../../config.js');
const db = require('../../utils/db.js')
const moment = require('../../utils/moment.js')
const middleware = require('../../middleware/app.js')

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
            await sock.readMessages([m.key])
            await updateAdminStatus(sock, m);
            const dbGroupData = await _dbGroupHandler(sock, m)
            m.db = {
                user: null,
                group: dbGroupData,
                bot: db.bot.get('settings'),
            }
            const command = Array.from(commands.values()).find((v) => v.cmd.find((x) => x.toLowerCase() == m.body.commandWithoutPrefix.toLowerCase()));
            const $next = await _middleware(sock, m, middleware, command?.withoutMiddleware)
            if(!command) return
            if(typeof $next == 'object' && !$next.continueCommand) return
            if(!command?.withoutPrefix && !m.body.prefix) return
            m.db.user = await _autoRegisterUser(sock, m)
            await command.run({m , sock})
            // console.log(m.db);
        } catch (error) {
            log.error("onMessageUpsert :" + error.message);
        }    
    })
}

const _middleware = async (sock, m, middlewares, withoutMiddleware) => {
    let $next = true
    for (let [key, middleware] of middlewares.entries()) {
        try {
            if(!withoutMiddleware) {
                await middleware.handdler(sock, m, true)
            } else if (!withoutMiddleware.includes(key)) {
                await middleware.handdler(sock, m, true)
            }
        } catch (error) {
            if(!error?.hideLogs) console.log({...error, ...{ sender: m.sender } });
            $next = error
            if(error?.break) break
        }
    }
    return $next
}

const _autoRegisterUser = async (sock, m) => {
    let dbUserData = null;
    dbUserData = await db.user.get(m.sender)
    if(!dbUserData) {
        await db.user.put(m.sender, {
            ...config.USER_DEFAULT,
            blacklist: false, // false = not in blacklist, true = in blacklist permanently, timestamp = in blacklist for some time
            blacklist_reason: '', // reason for blacklist
            updated_at: moment(), // update every time using bot
            created_at: moment(), // create time
        })
        dbUserData = await db.user.get(m.sender)
    } else {
        db.update(db.user, m.sender, {
            updated_at: moment(),
        })
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
                timeouts: {},
                updated_at: moment(),
                created_at: moment(),
            })
            dbGroupData = await db.group.get(group.id)
        }
    }
    return dbGroupData
}