const db = require('../../utils/db.js');
const moment = require('../../utils/moment.js');

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

            let text = `*\`❖ Mining Blockchain Progress\`*\n\n`
            for (const mine of mines) {
                if (moment().valueOf() > mine.value.remaining) {
                    text += `▷ *${mine.value.address}*: Mining Success\n`
                } else {
                    text += `▷ *${mine.value.address.split('@')[0]}*: ${moment(mine.value.remaining).diff(moment(), 'minutes')} minutes\n`
                }
            }

            m._reply(text);
        } catch(error){
            m._reply(error.message);
        }
    }
}