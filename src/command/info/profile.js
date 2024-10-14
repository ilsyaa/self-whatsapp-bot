const db = require('../../utils/db');
const moment = require('../../utils/moment');

module.exports = {
    name: "info-user",
    description: "Show Profile User",
    cmd: ['profile', 'user', 'id'],
    menu: {
        label: 'info'
    },
    withoutMiddleware: ['timeout.js'],
    run: async ({ m, sock }) => {
        let dbuser = null, avatar = null, timeoutGroup = null, id = null
        if(m.quoted) {
            id = m.quoted.sender
            dbuser = db.user.get(m.quoted.sender)
            avatar = await sock.profilePictureUrl(m.quoted.sender, 'image')
            timeoutGroup = Object.keys(m.db.group.timeouts).find(x => x == m.quoted.sender)
        } else if (m.mentionedJid.length) {
            id = m.mentionedJid[0]
            dbuser = db.user.get(m.mentionedJid[0])
            avatar = await sock.profilePictureUrl(m.mentionedJid[0], 'image')
            timeoutGroup = Object.keys(m.db.group.timeouts).find(x => x == m.mentionedJid[0])
        } else {
            id = m.sender
            dbuser = db.user.get(m.sender)
            avatar = await sock.profilePictureUrl(m.sender, 'image')
            timeoutGroup = Object.keys(m.db.group.timeouts).find(x => x == m.sender)
        }

        if(!dbuser) return m._reply('User tidak terdaftar.')

        let caption = `*Informasi*\n\n`
        caption += `ID : ${id}\n`
        caption += `Plan : ${dbuser.plan.charAt(0).toUpperCase() + m.db.user.plan.slice(1)}\n`
        if(m.db.user.plan != 'free') {
            caption += `Expired : ${dbuser.plan_expire}\n`
        }
        caption += `Exp : ${dbuser.exp}\n`
        caption += `Limit : ${dbuser.limit || 'Unlimited'}\n`
        caption += `Blacklist : ${dbuser.blacklist ? 'Yes' : 'No'}\n`
        caption += `Blacklist Reason : ${dbuser.blacklist_reason || '-'}\n`
        caption += `Timeout Group : ${timeoutGroup ? `${moment(m.db.group.timeouts[timeoutGroup]).diff(moment(), 'minutes')} minutes ${moment(m.db.group.timeouts[timeoutGroup]).diff(moment(), 'seconds') % 60} seconds` : '-'}\n`
        caption += `Last Online : ${moment(dbuser.updated_at).fromNow()}\n`
        caption += `Registered : ${moment(dbuser.created_at).fromNow()}\n`

        await m._sendMessage(m.chat, { image: { url: avatar }, caption }, { quoted: m })
    }
}