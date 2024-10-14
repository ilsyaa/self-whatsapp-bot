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
        const avatar = await sock.profilePictureUrl(m.sender, 'image')
        let timeoutGroup = Object.keys(m.db.group.timeouts).find(x => x == m.sender)
        timeoutGroup = timeoutGroup ? `${moment(m.db.group.timeouts[timeoutGroup]).diff(moment(), 'minutes')} minutes ${moment(m.db.group.timeouts[timeoutGroup]).diff(moment(), 'seconds') % 60} seconds` : '-';
        let caption = `*Informasi tentang profilemu*\n\n`
        caption += `ID : ${m.sender}\n`
        caption += `Plan : ${m.db.user.plan.charAt(0).toUpperCase() + m.db.user.plan.slice(1)}\n`
        if(m.db.user.plan != 'free') {
            caption += `Expired : ${m.db.user.plan_expire}\n`
        }
        caption += `Exp : ${m.db.user.exp}\n`
        caption += `Limit : ${m.db.user.limit || 'Unlimited'}\n`
        caption += `Blacklist : ${m.db.user.blacklist ? 'Yes' : 'No'}\n`
        caption += `Blacklist Reason : ${m.db.user.blacklist_reason || '-'}\n`
        caption += `Timeout Group : ${timeoutGroup}\n`
        caption += `Last Online : ${moment(m.db.user.updated_at).fromNow()}\n`
        caption += `Registered : ${moment(m.db.user.created_at).fromNow()}\n`

        await m._sendMessage(m.chat, { image: { url: avatar }, caption }, { quoted: m })
    }
}