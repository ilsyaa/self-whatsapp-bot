const db = require('../../utils/db.js');
const moment = require('../../utils/moment.js');
const config = require('../../../config.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: "blockchain-mine-progress",
    description: "Mining Blockchain Progress",
    cmd: ['miningprogress', 'mineprogress', 'minerprogress'],
    menu: {
        label: 'blockchain',
    },
    run: async ({ m, sock }) => {
        try {
            let mines = db.blockchain.mine.getRange()

            let text = `*\`❖ Mining Blockchain In Progress\`*\n\n`
            for (const mine of mines) {
                if (moment().valueOf() > mine.value.remaining) {
                    text += `▷ *${mine.value.address}*: Mining Success\n`
                } else {
                    text += `▷ *${mine.value.address.split('@')[0]}*: ${moment(mine.value.remaining).diff(moment(), 'minutes')} minutes\n`
                }
            }

            m._sendMessage(m.chat, {
                text: text,
                contextInfo: {
                    mentionedJid: [],
                    externalAdReply: {
                        title: `❖ Mining In Progress`,
                        body: `▷ Blockchain`,
                        thumbnail: fs.readFileSync(path.join(config.STORAGE_PATH, 'media/coin.jpg')),
                        sourceUrl: 'https://ilsya.my.id',
                        mediaType: 1,
                        // renderLargerThumbnail: true
                    }
                }
            }, { quoted: m, ephemeralExpiration: m.ephemeral })
        } catch(error){
            m._reply(error.message);
        }
    }
}