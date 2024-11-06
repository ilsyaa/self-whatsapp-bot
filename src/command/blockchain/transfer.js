const { BlockchainDB, Transaction } = require('../../utils/blockchain/index.js');
const blockchain = new BlockchainDB();
const currency = require('../../utils/currency.js');
const db = require('../../utils/db.js');
const config = require('../../../config.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "blockchain-transfer",
    description: "Transfer Blockchain",
    cmd: ['transfer', 'tfcoin', 'tf', 'tfblock'],
    menu: {
        label: 'blockchain',
    },
    run: async ({ m, sock }) => {
        try {
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

            if (id === m.sender) return m._reply(m.lang(msg).lucu);
            if (!Number(balance) || balance.trim() == '') return m._reply(m.lang(msg).ex);
            if (Number(balance) < 1) return m._reply(m.lang(msg).min);
            if (Number(balance) > 50000000) return m._reply(m.lang(msg).max);
            const user = db.user.get(id);
            if(!user) return m._reply(m.lang(msg).userNotFound);

            const result = await blockchain.transfer(m.sender, id, Number(balance));
            let text = `*\`❖ Transfer Blockchain Success\`*\n\n`;
            text += `▷ *ID Transaction*: ${result.txId}\n`
            text += `▷ *Amount*: ${currency.format(result.amount)} coin\n`
            text += `▷ *To*: ${result.to}`
            m._sendMessage(m.chat, {
                text: text,
                contextInfo: {
                    mentionedJid: [],
                    externalAdReply: {
                        title: `❖ Transfer Coin`,
                        body: `▷ Blockchain`,
                        thumbnail: fs.readFileSync(path.join(config.STORAGE_PATH, 'media/coin.jpg')),
                        sourceUrl: 'https://ilsya.my.id',
                        mediaType: 1,
                        // renderLargerThumbnail: true
                    }
                }
            }, { quoted: m, ephemeralExpiration: m.ephemeral })
        } catch (error) {
            if(error.message == 'Saldo tidak cukup!') return m._reply(m.lang(msg).saldoNotEnough);
            m._reply(error.message);
        }
    }
}


const msg = {
    id: {
        ex: 'Penggunaan:\n▷ {prefix}tf `nominal` `@mention`\n▷ Balas pesan dengan caption {prefix}tf `nominal`',
        max: 'Maksimal sekali transfer 50.000.000 coin.',
        min: 'Minimal 1 coin.',
        userNotFound: 'Pengguna tidak terdaftar.',
        saldoNotEnough: 'Balance kamu tidak cukup.',
        lucu: 'Jangan lucu lah. ngirim ke diri sendiri.'
    },
    en: {
        ex: 'Usage:\n▷ {prefix}tf `nominal` `@mention`\n▷ Reply to a message with caption {prefix}tf `nominal`',
        max: 'Maximal transfer 50.000.000 coin.',
        min: 'Minimal 1 coin.',
        userNotFound: 'User not found.',
        saldoNotEnough: 'Your balance is not enough.',
        lucu: 'Don\'t be funny. send to yourself.'
    }
}