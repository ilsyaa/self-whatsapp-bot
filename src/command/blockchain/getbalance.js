const db = require('../../utils/db.js');
const moment = require('../../utils/moment.js');
const { BlockchainDB, Transaction } = require('../../utils/blockchain/index.js');
const blockchain = new BlockchainDB();

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
        text += `▷ Address/Id : ${id}\n`
        text += `▷ Balance : ${await blockchain.getBalance(id)}\n\n`;
        text += `*\`❖ Transaction History\`*\n`
        text += String.fromCharCode(8206).repeat(4001)
        text +=history.map(tx =>
            `▷ ${new moment(tx.timestamp).toLocaleString()}\n` +
            `▷ ${tx.type === 'mining_reward' ? 'Mining Reward' : 'Transfer'}\n` +
            `▷ ${tx.from === m.sender ? 'To: ' + tx.to : 'From: ' + tx.from}\n` +
            `▷ Total: ${tx.amount} coin\n`
        ).join('\n');
   
        m._reply(text);
    }
}

const msg = {
    id : {
        userNotFound: '> Pengguna tidak terdaftar.',
    }
}