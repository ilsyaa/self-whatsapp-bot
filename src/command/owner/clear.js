const config = require("../../../config.js")
const db = require("../../utils/db.js")
const path = require("path")
const fs = require("fs")

module.exports = {
    name : "bot-clear",
    description : "Clear Cache Bot",
    cmd : ['clear', 'refresh'],
    run : async({ m, sock }) => {
        try {
            if(!m.senderIsOwner) return
            
            const groupExists = await sock.groupFetchAllParticipating()
            let deletedGroups = 0
            for (let { key, value } of db.group.getRange()) {
                if(groupExists[key]) continue
                await db.group.remove(key)
                deletedGroups++
            }

            const dirTemp = path.join(config.STORAGE_PATH, 'temp')
            let files = fs.readdirSync(dirTemp)
            let deletedFiles = 0
            for (let file of files) {
                if(file === '.gitignore') continue
                fs.unlinkSync(path.join(dirTemp, file))
                deletedFiles++
            }

            let text = `*\`❖ Clear Cache\`*\n\n`
            text += `▷ Total Group: ${db.group.getCount()}\n`
            text += `▷ Deleted Group: ${deletedGroups}\n\n`
            text += `▷ Temp Files: ${files.length}\n`
            text += `▷ Deleted Temp Files: ${deletedFiles}\n\n`
            
            await m._sendMessage(m.chat, {
                text,
                contextInfo: {
                    externalAdReply: {
                        title: 'Nakiri Whatsapp BOT',
                        body: '- Clear Cache -',
                        mediaType: 2,
                        thumbnail: m.db.bot.icon,
                        sourceUrl: 'https://velixs.com',
                    }
                }
            }, { quoted: m });
        } catch(error) {
            await m._reply(error.message)
        }
    }
}