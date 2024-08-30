const { menuByLabel } = require("../utils/loadCommands.js")

module.exports = {
    name : "menu",
    description : "Menu Bot Velixs-Bot",
    cmd : ['help', 'menu'],
    run : async({ m, sock }) => {
        let text = ''
        text += '*😺 Menu* ඞ\n\n'
        menuByLabel.forEach((val, key) => {
            text += `┌── ˗ˏˋ ★ ${key} ★ ˎˊ˗\n`
            val.forEach((v) => {
                text += `» ${v.cmd[0]} ${v.example}\n`
            })
            text += `└────────────\n\n`
        })

        // text += `\n`
        // text += `_👑 author: Ilsya_\n`
        await m._sendMessage(m.chat, { text: text }, { quoted: m })
    }
}