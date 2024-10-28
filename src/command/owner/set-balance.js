const currency = require('../../utils/currency.js')
const moment = require('../../utils/moment.js')
const db = require('../../utils/db.js')

module.exports = {
    name: "owner-set-coin",
    description: "Set Balance",
    cmd: ['setbalance', 'setcoin', 'setbalance'],
    run: async ({ m, sock }) => {
        if(!m.senderIsOwner) return

        let ids = [], balance, nameText = 0, balanceText;

        if(m.quoted) {
            ids = [ m.quoted.sender ]
            balance = m.body.arg.split(' ')[0].replace(/[^0-9]/g, '')
        } else if(m.mentionedJid.length) {
            ids = m.mentionedJid
            balance = m.body.arg.split(' ')[0].replace(/[^0-9]/g, '')
        } else if(m.body.arg.split(' ')[1] == 'all') {
            for(let user of db.user.getRange()) {
                ids = ids.concat(user.key)
            }
            balance = m.body.arg.split(' ')[0].replace(/[^0-9]/g, '')
        } else if (m.body.arg.split(' ')[1]) {
            balance = m.body.arg.split(' ')[0].replace(/[^0-9]/g, '')
            ids = [ m.body.arg.split(' ')[1].replace(/[^0-9]/g, '')+'@s.whatsapp.net' ]
        } else return m._reply(m.lang(msg).ex)
        
        for(const id of ids) {
            const user = await db.user.get(id);
            if(!user && ids.length == 1) return m._reply(m.lang(msg).userNotFound);
            if(!user && ids.length > 1) continue;
            await db.update(db.user, id, { balance: balance , updated_at: moment() });
            balanceText = currency.format(balance)
            if(ids.length == 1) {
                nameText = user.name
            } else {
                nameText = parseInt(nameText)+1
            }
        }
        if (ids.length > 1) nameText = nameText + ' ' + m.lang(msg).users;
        await m._reply(m.lang(msg).success.replace('{name}', nameText).replace('{balance}', currency.format(balanceText)));
    }
}

const msg = {
    id: {
        userNotFound: 'Pengguna tidak terdaftar.',
        success: 'Saldo `{name}` di set ke `{balance}`.',
        ex: 'Penggunaan:\n▷ {prefix}setbalance `nominal` `<@mentions|all>`\n▷ Balas pesan dengan caption {prefix}setbalance `nominal`',
        users: 'pengguna',
    },
    en: {
        userNotFound: 'User not found.',
        success: 'Balance `{name}` has been set to `{balance}`.',
        ex: 'Usage:\n▷ {prefix}setbalance `nominal` `<@mentions|all>`\n▷ Reply to a message with caption {prefix}setbalance `nominal`',
        users: 'users'
    }   
}