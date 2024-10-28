const db = require('../../utils/db.js');
const moment = require('../../utils/moment.js');
const currency = require('../../utils/currency.js');

module.exports = {
    name: "info-user",
    description: "Show Profile User",
    cmd: ['profile', 'user', 'id'],
    menu: {
        label: 'info'
    },
    withoutMiddleware: ['timeout.js'],
    run: async ({ m, sock }) => {
        let dbuser = null, 
            avatar = "https://i.ibb.co.com/1QRWZTd/146de169d3133554a6d907b837d31377.jpg", 
            timeoutGroup = null, 
            id = null;
            
        if(m.quoted) {
            id = m.quoted.sender
        } else if (m.mentionedJid.length) {
            id = m.mentionedJid[0]
        } else {
            id = m.sender
        }
        const leaderboard = Object.entries(m.db?.group?.member_activity || {})
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([member, activity], index) => ({
                rank: index + 1,
                member,
                activity
            }));
        
        try {
            avatar = await sock.profilePictureUrl(id, 'image')
        } catch {} finally {
            dbuser = db.user.get(id)
            if(!dbuser) return m._reply(m.lang(msg).userNotFound)
                
            timeoutGroup = Object.keys(m.db?.group?.timeouts || {}).find(x => x == id)

            let caption = `\`❖ PERSONAL\`\n`;
            caption += `▷ Name : ${dbuser.name}\n`
            caption += `▷ Plan : ${dbuser.plan.charAt(0).toUpperCase() + m.db.user.plan.slice(1)}\n`
            if(m.db.user.plan != 'free') caption += `Expired : ${dbuser.plan_expire}\n`
            caption += `▷ Exp : ${dbuser.exp}\n`
            caption += `▷ Balance : ${currency.format(dbuser.balance)}\n`
            caption += `▷ Limit : ${dbuser.limit || 'Unlimited'}\n`
            caption += `▷ Blacklist : ${dbuser.blacklist_reason || '-'}\n\n`
            if(m.isGroup) {
                caption += `\`❖ GROUP ID\`\n`
                caption += `▷ Timeout Group : ${timeoutGroup ? `${moment(m.db.group.timeouts[timeoutGroup]).diff(moment(), 'minutes')} minutes ${moment(m.db.group.timeouts[timeoutGroup]).diff(moment(), 'seconds') % 60} seconds` : '-'}\n`
                caption += `▷ Leaderboard : ${leaderboard.find(({member}) => member == id)?.rank || '-'} of ${m.isGroup.groupMetadata.size}\n`
                caption += `\n`
            }
            caption += `▷ Last Online : ${moment(dbuser.updated_at).fromNow()}\n`
            caption += `▷ Registered : ${moment(dbuser.created_at).fromNow()}\n`
    
            await m._sendMessage(m.chat, {
                text : caption,
                contextInfo: {
                    externalAdReply: {
                        title: m.db.user.name,
                        body: id,
                        mediaType: 2,
                        thumbnailUrl: avatar,
                        sourceUrl: 'https://velixs.com', 
                    }
                }
            }, { quoted: m });
        }
    }
}

const msg = {
    id: {
        userNotFound: 'User tidak terdaftar.',
    },
    en: {
        userNotFound: 'User not found.',
    }
}