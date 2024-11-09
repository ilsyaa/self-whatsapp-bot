const { BlockchainDB, Transaction } = require('../../utils/blockchain/index.js');
const blockchain = new BlockchainDB();
const currency = require('../../utils/currency.js');
const moment = require('../../utils/moment.js');
const config = require('../../../config.js');
const fs = require('fs');
const path = require('path');
const exp = require('../../utils/exp.js');
const db = require('../../utils/db.js');

module.exports = {
    name: "blockchain-daily",
    description: "Daily Claim",
    cmd: ['claim', 'daily'],
    menu: {
        label: 'blockchain',
    },
    run: async ({ m, sock }) => {
        if(m.db.user?.daily) {
            if(moment(m.db.user.daily).startOf('day').diff(moment().startOf('day'), 'days') < 1) return m._reply(m.lang(msg).dailyClaimed)
        }

        let blockchainDaily = 50000;
        let expDaily = Math.floor(Math.random() * 500) + 10;
        let limitDaily = 15;

        try {
            await blockchain.transfer('unknown@s.whatsapp.net', m.sender, blockchainDaily);
        } catch(e) {
            blockchainDaily = 0
        }
        exp.add(m.sender, expDaily);
        db.update(db.user, m.sender, { daily: moment(), limit: (limitDaily + parseInt(m.db.user.limit)) });

        let text = `*\`❖ Daily Event\`*\n\n`;
        text += `▷ *Blockchain*: ${currency.format(blockchainDaily)}\n`
        text += `▷ *Exp*: ${currency.format(expDaily)}\n`
        text += `▷ *Limit*: ${currency.format(limitDaily)}\n`
        m._sendMessage(m.chat, {
            text: text,
            contextInfo: {
                mentionedJid: [],
                externalAdReply: {
                    title: `❖ Daily Event`,
                    body: `▷ Nakiri BOT`,
                    thumbnail: fs.readFileSync(path.join(config.STORAGE_PATH, 'media/coin.jpg')),
                    sourceUrl: 'https://ilsya.my.id',
                    mediaType: 1,
                    // renderLargerThumbnail: true
                }
            }
        }, { quoted: m })
    }
}

const msg = {
    id : {
        dailyClaimed: 'Kamu sudah mengklaim harian anda 😺',
    },
    en : {
        dailyClaimed: 'You have already claimed your daily reward today',
    }
}