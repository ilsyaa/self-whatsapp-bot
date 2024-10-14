const db = require('../../utils/db.js')
const moment = require('../../utils/moment.js')

module.exports = {
    name : "group-timeout-list",
    description : "Menampilkan member yang timeout di group",
    cmd : ['list-timeout', 'list-to', 'list-bungkam'],
    menu : {
        label : 'group',
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.botIsAdmin) return
            
            const timeouts = db.group.get(m.isGroup.groupMetadata.id).timeouts
            
            let text = ``
            for (const [key, value] of Object.entries(timeouts)) {
                text += `*${key}*\n`
                text += `▷ Date Expired: _${moment(value).format('DD-MM-YYYY HH:mm:ss')}_\n`
                text += `▷ Time Left: _${moment(value).diff(moment(), 'minutes')} minutes ${moment(value).diff(moment(), 'seconds') % 60} seconds_\n\n`
            }

            await m._sendMessage(m.chat, { text: text }, { quoted: m })
        } catch(error) {
            await m._reply(error.message)
        }
    }
}