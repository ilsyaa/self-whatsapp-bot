const { menuByLabel } = require("../utils/loadCommands.js")
const timer2 = require("../utils/timer2.js")
const fs = require('fs');
const path = require('path');
const config = require("../../config.js");

module.exports = {
    name : "menu",
    description : "Menu Bot Velixs-Bot",
    cmd : ['help', 'menu'],
    run : async({ m, sock }) => {
        let text = ''
        text += `*😺 Menu* ඞ\n ${timer2()} \n\n`
        text += String.fromCharCode(8206).repeat(4001)
        menuByLabel.forEach((val, key) => {
            text += `┌── ˗ˏˋ ★ ${key} ★ ˎˊ˗\n`
            val.forEach((v) => {
                text += `▷ ${m.body.prefix + v.cmd[0]} ${v.example || ''}\n`
            })
            text += `└────────────\n\n`
        })

        text += `\n`
        text += `_👑 author: Ilsya_\n`

        await m._sendMessage(m.chat, {
            text,
            contextInfo: {
                externalAdReply: {
                    title: 'Nakiri Whatsapp BOT',
                    body: '- Menu -',
                    mediaType: 2,
                    thumbnail: fs.readFileSync(path.join(config.STORAGE_PATH, 'assets/icon-message.jpg')),
                    sourceUrl: 'https://velixs.com', 
                }
            }
        }, { quoted: m });
    }
}