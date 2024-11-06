const fs = require('fs')
const path = require('path')
const config = require('../../../config.js')
const currency = require('../../utils/currency.js')
const { BlockchainDB, Transaction } = require('../../utils/blockchain/index.js');
const db = require('../../utils/db.js');
const blockchain = new BlockchainDB();

module.exports = {
    name: "store-limit",
    description: "Store Limit",
    cmd: [ 'buylimit' ],
    menu: {
        label: 'store'
    },
    run: async ({ m, sock }) => {
        let list = '*\`❖ List Limit For Sale\`* \n'
        list += `> Purchase uses Blockchain\n\n`
        list += `*\`1\`* 5 Limit \`100.000 Coin\`\n`
        list += `*\`2\`* 15 Limit \`250.000 Coin\`\n`
        list += `*\`3\`* 50 Limit \`450.000 Coin\`\n`
        list += `*\`4\`* 100 Limit \`800.000 Coin\`\n`
        list += `\n`
        list += `> If you want to buy limit, please use command ${m.body.prefix}buylimit \`number\``
        if(!m.body.arg.trim()) {
            return m._sendMessage(m.chat, {
                text: list,
                contextInfo: {
                    mentionedJid: [],
                    externalAdReply: {
                        title: `❖ Store Blockchain`,
                        body: `▷ Limit`,
                        thumbnail: fs.readFileSync(path.join(config.STORAGE_PATH, 'media/coin.jpg')),
                        sourceUrl: 'https://ilsya.my.id',
                        mediaType: 1,
                    }
                }
            }, { quoted: m })
        } 

        let number = m.body.arg.replace(/[^0-9]/g, '')

        let limit = 0, coin = 0;
        switch (Number(number)) {
            case 1:
                limit = 5
                coin = 100000
                break;
            case 2:
                limit = 15
                coin = 250000
                break;
            case 3:
                limit = 50
                coin = 450000
                break;
            case 4:
                limit = 100
                coin = 800000
                break;
            default:
                return m._reply(m.lang(msg).notFound)
                break;
        }
        if(!limit || !coin) return m._reply(m.lang(msg).notFound);
        try {
            const transfer = await blockchain.transfer(m.sender, 'unknown@s.whatsapp.net', coin);
            db.update(db.user, m.sender, { limit: (parseInt(m.db.user.limit) + parseInt(limit)) })
            let text = `*\`❖ Buy Limit\`*\n\n`
            text += `▷ *ID Transaction*: ${transfer.txId}\n`
            text += `▷ *Limit*: ${limit}\n`
            text += `▷ *Price*: ${currency.format(transfer.amount)} coin\n`
            text += `▷ *Status*: Success\n`
            m._sendMessage(m.chat, {
                text: text,
                contextInfo: {
                    mentionedJid: [],
                    externalAdReply: {
                        title: `❖ Store Blockchain`,
                        body: `▷ Limit`,
                        thumbnail: fs.readFileSync(path.join(config.STORAGE_PATH, 'media/coin.jpg')),
                        sourceUrl: 'https://ilsya.my.id',
                        mediaType: 1,
                    }
                }
            }, { quoted: m })
        } catch (error) {
            if(error.message == 'Saldo tidak cukup!') return m._reply(m.lang(msg).saldoNotEnough)
            return m._reply(m.lang(msg).ex)
        }
    }
}

const msg = {
    id: {
        notFound: 'Berikan pilihan yang ada di list.',
        saldoNotEnough: 'Coin kamu tidak cukup.',
    },
    en: {
        notFound: 'Please choose from the list.',
        saldoNotEnough: 'Your blockchain balance is not enough.',
    }
}
