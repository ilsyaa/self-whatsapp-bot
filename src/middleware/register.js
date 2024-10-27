const moment = require('../utils/moment.js');
const config = require('../../config.js');
const db = require('../utils/db.js');

const intended = new Map();
const expiredIntended = 60; // seconds

module.exports = {
    handler : async (sock, m, $next, command) => {
        if(m.fromMe) return $next
        
        // if user not register and try command bot
        if (!m.db?.user && m.body.prefix) {
            // if user try to register
            if(m.body.commandWithoutPrefix == 'reg' && m.body.arg) {
                const name = m.body.arg.replace(/[^A-Za-z ]/g, '');
                if(name.length < 3) return m._reply(m.lang(msg).min);
                console.log('Registering User : ' + name);
                await db.user.put(m.sender, { name, ...config.DATABASE_SCHEMA.user})
                intended.delete(m.sender);
                m._reply(m.lang(msg).success.replace('{name}', name));
            } else if (!intended.has(m.sender) || moment().isAfter(intended.get(m.sender).expired) && command) {
                intended.set(m.sender, {
                    command: m.body.commandWithoutPrefix,
                    expired: moment().add(expiredIntended, 'seconds')
                });
                m._reply(m.lang(msg).register);
            }

            throw {
                break: false, // continue code
                continueCommand: false, // but dont execute command
                message: 'User has not registered.',
                hideLogs: true
            }
        }
        
        return $next;
    }
}

const msg = {
    id : {
        register : 'Silahkan lakukan registrasi terlebih dahulu.\nCaranya ketik {prefix}reg `nama`',
        success : 'Hai {name} silahkan menggunakan bot dengan bijak.\nUntuk mengecek profile ketik `{prefix}id`\nUntuk menampilkan semua fitur bot ketik `{prefix}help`',
        min: 'Minimal 3 huruf.',
    },
    en : {
        register : 'Please register first.\nHow to register : {prefix}reg `name`',
        success : 'Hi {name} please use the bot with caution.\nTo check profile type `{prefix}id`\nTo show all features type `{prefix}help`',
        min: 'Minimal 3 character.',
    }
}