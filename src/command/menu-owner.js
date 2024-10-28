const timer2 = require("../utils/timer2.js")
const fs = require('fs');
const path = require('path');
const config = require("../../config.js");

module.exports = {
    name : "menu-owner",
    description : "Menu Owner Bot",
    cmd : ['mowner', 'menu-owner'],
    run : async({ m, sock }) => {
        if(!m.senderIsOwner) return
        let text = ''
        text += `*😺 Menu* ඞ\n ${timer2()} \n\n`
        text += `┌── ˗ˏˋ ★ Owner Menu ★ ˎˊ˗\n`
        text += `▷ ${m.body.prefix}bot \n`
        text += `▷ ${m.body.prefix}clear \n`
        text += `▷ ${m.body.prefix}block \n`
        text += `▷ ${m.body.prefix}unblock \n`
        text += `▷ ${m.body.prefix}iconmsg \n`
        text += `▷ ${m.body.prefix}setpp \n`
        text += `▷ ${m.body.prefix}join <link> \n`
        text += `▷ ${m.body.prefix}leave \n`
        text += `▷ ${m.body.prefix}mode <public/private> \n`
        text += `▷ ${m.body.prefix}lang <id/en> \n`
        text += `▷ ${m.body.prefix}prefix\n`
        text += `▷ ${m.body.prefix}owner\n`
        text += `▷ ${m.body.prefix}exif\n`
        text += `▷ ${m.body.prefix}unreg \`@mention\`\n`
        text += `▷ ${m.body.prefix}addbalance \`nominal\` \`@mentions\`\n`
        text += `▷ ${m.body.prefix}setbalance \`nominal\` \`@mentions\`\n`
        text += `▷ ${m.body.prefix}$\n`
        text += `▷ ${m.body.prefix}~\n`
        text += `└────────────\n\n`

        text += `\n`
        text += `_👑 author: Ilsya_\n`
        await m._sendMessage(m.chat, {
            text,
            contextInfo: {
                externalAdReply: {
                    title: 'Nakiri Whatsapp BOT',
                    body: '- Menu -',
                    mediaType: 2,
                    thumbnail: m.db.bot.icon,
                    sourceUrl: 'https://velixs.com', 
                }
            }
        }, { quoted: m });
    }
}