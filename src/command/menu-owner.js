const timer2 = require("../utils/timer2.js")

module.exports = {
    name : "menu-owner",
    description : "Menu Owner Bot",
    cmd : ['mowner', 'menu-owner'],
    run : async({ m, sock }) => {
        if(!m.senderIsOwner) return
        let text = ''
        text += `*😺 Menu* ඞ\n ${timer2()} \n\n`
        text += `┌── ˗ˏˋ ★ Owner Menu ★ ˎˊ˗\n`
        text += `▷ ${m.body.prefix}block \n`
        text += `▷ ${m.body.prefix}unblock \n`
        text += `▷ ${m.body.prefix}eval \n`
        text += `▷ ${m.body.prefix}join <link> \n`
        text += `▷ ${m.body.prefix}leave \n`
        text += `▷ ${m.body.prefix}mode <public/private> \n`
        text += `└────────────\n\n`

        text += `\n`
        text += `_👑 author: Ilsya_\n`
        await m._sendMessage(m.chat, { text: text }, { quoted: m })
    }
}