const db = require('../../utils/db.js');
const moment = require('../../utils/moment.js');
const { BlockchainDB, Transaction } = require('../../utils/blockchain/index.js');
const blockchain = new BlockchainDB();
const config = require('../../../config.js');
const fs = require('fs');
const path = require('path');
const currency = require('../../utils/currency.js');

module.exports = {
    name: "blockchain-getbalance",
    description: "Get Balance By Address",
    cmd: ['getbalance', 'history', 'gethistory', 'balance'],
    menu: {
        label: 'blockchain',
    },
    run: async ({ m, sock }) => {
        let id;
        if(m.quoted) {
            id = m.quoted.sender
        } else if (m.mentionedJid.length) {
            id = m.mentionedJid[0]
        } else if (m.body.arg) {
            id = m.body.arg
        } else {
            id = m.sender
        }

        const user = await db.user.get(id);
        if (!user) return m._reply(m.lang(msg).userNotFound);
        const history = await blockchain.getTransactionHistory(m.sender);
        
        let text = `*\`❖ Blockchain\`*\n`;
        text += `▷ Address/Id : ${id.split('@')[0]}\n`
        text += `▷ Balance : ${currency.format(await blockchain.getBalance(id))}\n\n`;
        text += `*\`❖ Transaction History\`*\n`
        text += String.fromCharCode(8206).repeat(4001)
        text +=history.map(tx =>
            `▷ ${new moment(tx.timestamp).toLocaleString()}\n` +
            `▷ ${tx.type === 'mining_reward' ? 'Mining Reward' : 'Transfer'}\n` +
            `▷ ${tx.from === m.sender ? 'To: ' + tx.to : 'From: ' + tx.from}\n` +
            `▷ Total: ${currency.format(tx.amount)} coin\n`
        ).join('\n');
   
        m._sendMessage(m.chat, {
            text: text,
            contextInfo: {
                mentionedJid: [],
                externalAdReply: {
                    title: `❖ ${user.name}`,
                    body: `▷ Blockchain`,
                    thumbnail: fs.readFileSync(path.join(config.STORAGE_PATH, 'media/coin.jpg')),
                    sourceUrl: 'https://ilsya.my.id',
                    mediaType: 1,
                    // renderLargerThumbnail: true
                }
            }
        }, { quoted: m, ephemeralExpiration: m.ephemeral })
    }
}

const msg = {
    id : {
        userNotFound: '> Pengguna tidak terdaftar.',
    }
}