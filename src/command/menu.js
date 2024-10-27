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
        text += `*\`Hai ${m.db.user.name}\`*\n ${timer2()} \n\n`
        text += String.fromCharCode(8206).repeat(4001)
        if(m.body.arg) {
            let filterMenu = menuByLabel.get(m.body.arg)
            if(!filterMenu) return
            text += `\`❖ ${m.body.arg.toUpperCase()}\`\n`
            filterMenu.forEach((v) => {
                text += `▷  ${m.body.prefix + v.cmd[0]} _\`${v.example || ''}\`_\n`
            })
        } else {
            menuByLabel.forEach((val, key) => {
                text += `\`❖ ${key.toUpperCase()}\`\n`
                val.forEach((v) => {
                    text += `▷  ${m.body.prefix + v.cmd[0]} _\`${v.example || ''}\`_\n`
                })
                text += `\n\n`
            })
        }
        text += `\n`
        text += `_👑 author: Ilsya_\n`

        await m._sendMessage(m.chat, {
            text,
            contextInfo: {
                externalAdReply: {
                    title: 'Nakiri Whatsapp BOT',
                    body: '- All Menu -',
                    mediaType: 2,
                    thumbnail: m.db.bot.icon,
                    sourceUrl: 'https://velixs.com',
                }
            }
        }, { quoted: m });
    }
}