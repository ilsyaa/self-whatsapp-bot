const currency = require('../../utils/currency.js')
const moment = require('../../utils/moment.js')
const db = require('../../utils/db.js')

module.exports = {
    name: "owner-add-coin",
    description: "Add Balance",
    cmd: ['addbalance', 'addcoin', 'addsaldo'],
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
            await db.update(db.user, id, { balance: currency.add(user.balance, balance) , updated_at: moment() });
            balanceText = currency.format(balance)
            if(ids.length == 1) {
                nameText = user.name
            } else {
                nameText = parseInt(nameText)+1
            }
        }
        if (ids.length > 1) nameText = nameText + ' ' + m.lang(msg).users;
        await m._reply(m.lang(msg).success.replace('{name}', nameText ).replace('{balance}', currency.format(balanceText)));

    }
}

const msg = {
    id: {
        userNotFound: 'Pengguna tidak terdaftar.',
        success: 'Saldo `{name}` ditambahkan sebesar `{balance}`.',
        ex: 'Penggunaan:\n▷ {prefix}addbalance `nominal` `<@mentions|all>`\n▷ Balas pesan dengan caption {prefix}addcoin `nominal`',
        users: 'pengguna',
    },
    en: {
        userNotFound: 'User not found.',
        success: 'Balance `{name}` has been added with `{balance}`.',
        ex: 'Usage:\n▷ {prefix}addbalance `nominal` `<@mentions|all>`\n▷ Reply to a message with caption {prefix}addcoin `nominal`',
        users: 'users'
    }
}