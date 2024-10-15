const db = require('../../utils/db.js');
const moment = require('../../utils/moment.js');

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
        
        try {
            avatar = await sock.profilePictureUrl(id, 'image')
        } catch {} finally {
            dbuser = db.user.get(id)
            if(!dbuser) return m._reply(m.lang(msg).userNotFound)
                
            timeoutGroup = m.isGroup ? Object.keys(m.db.group.timeouts).find(x => x == id) : null

            let caption = `*Informasi*\n\n`
            caption += `ID : ${id}\n`
            caption += `Plan : ${dbuser.plan.charAt(0).toUpperCase() + m.db.user.plan.slice(1)}\n`
            if(m.db.user.plan != 'free') caption += `Expired : ${dbuser.plan_expire}\n`
            caption += `Exp : ${dbuser.exp}\n`
            caption += `Limit : ${dbuser.limit || 'Unlimited'}\n`
            caption += `Blacklist : ${dbuser.blacklist ? 'Yes' : 'No'}\n`
            caption += `Blacklist Reason : ${dbuser.blacklist_reason || '-'}\n`
            if(m.isGroup) (caption += `Timeout Group : ${timeoutGroup ? `${moment(m.db.group.timeouts[timeoutGroup]).diff(moment(), 'minutes')} minutes ${moment(m.db.group.timeouts[timeoutGroup]).diff(moment(), 'seconds') % 60} seconds` : '-'}\n`)
            caption += `Last Online : ${moment(dbuser.updated_at).fromNow()}\n`
            caption += `Registered : ${moment(dbuser.created_at).fromNow()}\n`
    
            await m._sendMessage(m.chat, { image: { url: avatar }, caption }, { quoted: m })
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