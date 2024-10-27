const { serialize, updateAdminStatus } = require('../../utils/serialize.js');
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
            m.db.group = await _dbGroupHandler(sock, m)
            m.db.user = await db.user.get(m.sender) || null;
            m.lang = (msg) => _lang(msg, m);
            const command = Array.from(commands.values()).find((v) => v.cmd.find((x) => x.toLowerCase() == m.body.commandWithoutPrefix.toLowerCase()));
            const $next = await _middleware(sock, m, middleware, command)
            if(!command) return
            if(typeof $next == 'object' && !$next.continueCommand) return
            if(!command?.withoutPrefix && !m.body.prefix) return
            _userOnlineHandler(sock, m)
            await command.run({m , sock})
            // console.log(m.db);
        } catch (error) {
            console.error(error);
        }    
    })
}

const _middleware = async (sock, m, middlewares, command) => {
    let $next = true
    for (let [key, middleware] of middlewares.entries()) {
        try {
            if(!command?.withoutMiddleware) {
                await middleware.handler(sock, m, true, command)
            } else if (!command?.withoutMiddleware.includes(key)) {
                await middleware.handler(sock, m, true, command)
            }
        } catch (error) {
            if(!error?.hideLogs) console.log(error);
            $next = error
            if(error?.break) break
        }
    }
    return $next
}

const _userOnlineHandler = async (sock, m) => {
    if(!m.db?.user) return
    db.update(db.user, m.sender, {
        updated_at: moment(),
    })
}

const _dbGroupHandler = async (sock, m) => {
    let dbGroupData = null;
    if(m.isGroup) {
        const group = m.isGroup.groupMetadata
        dbGroupData = await db.group.get(group.id)
        if(!dbGroupData) {
            await db.group.put(group.id, {
                ...{ name: group.subject },
                ...config.DATABASE_SCHEMA.group
            })
            dbGroupData = await db.group.get(group.id)
        }
    }
    return dbGroupData
}

const _lang = (msg, m) => {
    let lang = 'id', res = msg
    
    if(m.isGroup && m.db.group?.lang) {
        lang = m.db.group.lang
    } else if(m.db.bot.lang) {
        lang = m.db.bot.lang
    }

    // copy object
    res = { ...res[lang] }
    for (const [key, value] of Object.entries(res)) {
        if (typeof value === 'object') {
            for (let i = 0; i < value.length; i++) {
                res[key][i] = value[i].replaceAll('{prefix}', m.body.prefix)
            }
        } else {
            res[key] = value.replaceAll('{prefix}', m.body.prefix)
        }
    }
    return res
}