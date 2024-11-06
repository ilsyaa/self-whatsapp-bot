const { BlockchainDB, Transaction } = require('../../utils/blockchain/index.js');
const blockchain = new BlockchainDB();
const currency = require('../../utils/currency.js');
const db = require('../../utils/db.js');

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
            return `▷ \`${index + 1}\` ${user?.name || 'Unknown'} ${address.split('@')[0]}: ${currency.format(balance)} coin\n`
        }).join('\n');
   
        m._reply(text);
    }
}

const msg = {
    id : {
        userNotFound: '> Pengguna tidak terdaftar.',
    }
}