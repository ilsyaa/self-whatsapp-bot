const { BlockchainDB, Transaction } = require('../../utils/blockchain/index.js');
const blockchain = new BlockchainDB();
const currency = require('../../utils/currency.js');
const db = require('../../utils/db.js');
const config = require('../../../config.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "blockchain-holders",
    description: "Top Holders Blockchain",
    cmd: ['topholders', 'holders'],
    menu: {
        label: 'blockchain',
    },
    run: async ({ m, sock }) => {
        
        const balances = await blockchain.getAllBalances();
        const sortedHolders = Object.entries(balances)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20);
            
        let text = `*\`❖ Top ${sortedHolders.length} Holders Blockchain\`*\n\n`;
        text += sortedHolders.map(([address, balance], index) => {
            const user = db.user.get(address);
            if (user)  {
                return `▷ \`${index + 1}\` ${user?.name || 'Unknown'} ${address.split('@')[0]}: ${currency.format(balance)} coin\n`
            }
        }).join('\n');
   
        m._sendMessage(m.chat, {
            text: text,
            contextInfo: {
                mentionedJid: [],
                externalAdReply: {
                    title: `❖ Top ${sortedHolders.length} Holders`,
                    body: `▷ Blockchain`,
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
        userNotFound: '> Pengguna tidak terdaftar.',
    }
}