const { BlockchainDB, Transaction } = require('../../utils/blockchain/index.js');
const blockchain = new BlockchainDB();
const currency = require('../../utils/currency.js');
const moment = require('../../utils/moment.js');

module.exports = {
    name: "blockchain-stats",
    description: "All About Blockchain",
    cmd: ['blockchain', 'stats'],
    menu: {
        label: 'blockchain',
    },
    run: async ({ m, sock }) => {
        const stats = await blockchain.getCoinStats();
        let text = `*\`❖ Stats Blockchain\`*\n\n`;
        text += `▷ *Current Supply*: ${currency.format(stats.currentSupply)}\n`
        text += `▷ *Max Supply*: ${currency.format(stats.maxSupply)}\n`
        text += `▷ *Remaining Supply*: ${currency.format(stats.remainingSupply)}\n`
        text += `▷ *Current Reward Miner*: ${currency.format(stats.currentReward)}\n`
        text += `▷ *Block Mined*: ${currency.format(stats.blocksMined)}\n`
        text += `▷ *Blocks Until Halving*: ${currency.format(stats.blocksUntilHalving)}\n\n`
        text += `▷ *Current Time*: ${moment().format('DD-MM-YYYY HH:mm:ss')}`
        m._reply(text);
    }
}