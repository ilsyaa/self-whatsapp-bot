const currency = require('../../utils/currency.js')
const db = require('../../utils/db.js')

module.exports = {
    name: "info-transfer",
    description: "Transfer Bot Currency",
    cmd: ['transfer', 'tf'],
    menu: {
        label: 'info',
        example: 'balance <@mention>'
    },
    run: async ({ m, sock }) => {
        let id, balance;
        if (m.quoted) {
            id = m.quoted.sender;
            balance = m.body.arg.split(' ')[0].replace(/[^0-9]/g, '');
        } else if (m.mentionedJid.length) {
            id = m.mentionedJid[0];
            balance = m.body.arg.split(' ')[0].replace(/[^0-9]/g, '');
        } else if (m.body.arg.split(' ')[1]) {
            id = m.body.arg.split(' ')[1].replace(/[^0-9]/g, '')+'@s.whatsapp.net';
            balance = m.body.arg.split(' ')[0].replace(/[^0-9]/g, '');
        } else return m._reply(m.lang(msg).ex);

        const user = await db.user.get(id);
        if (!user) return m._reply(m.lang(msg).userNotFound);

        if (currency.subtract(m.db.user.balance, balance) === false) return m._reply(m.lang(msg).saldoNotEnough);
        currency.updateBalanceUser(m.sender, currency.subtract(m.db.user.balance, balance));
        currency.updateBalanceUser(id, currency.add(user.balance, balance));

        m._reply(m.lang(msg).success.replace('{name}', user.name).replace('{balance}', currency.format(balance)));
    }
}

const msg = {
    id: {
        ex: 'Penggunaan:\n▷ {prefix}tf `nominal` `@mention`\n▷ Balas pesan dengan caption {prefix}tf `nominal`',
        userNotFound: 'Pengguna tidak terdaftar.',
        saldoNotEnough: 'Saldo kamu tidak cukup.',
        success: 'Berhasil transfer ke `{name}` sebesar `{balance}`.',
    },
    en: {
        ex: 'Usage:\n▷ {prefix}tf `nominal` `@mention`\n▷ Reply to a message with caption {prefix}tf `nominal`',
        userNotFound: 'User not found.',
        saldoNotEnough: 'Your balance is not enough.',
        success: 'Transfer to `{name}` with `{balance}`.',
    }   
}