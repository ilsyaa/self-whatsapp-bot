// const config = require("../../../config.js")
module.exports = {
    name: "info-user",
    description: "Show Profile User",
    cmd: ['profile', 'user', 'id'],
    menu: {
        label: 'info'
    },
    run: async ({ m, sock }) => {
        const avatar = await sock.profilePictureUrl(m.sender, 'image')
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
        caption += `Created At : ${new Date(m.db.user.created_at).toLocaleString('id-ID', {timeZone: 'Asia/Jakarta' })}\n`

        await m._sendMessage(m.chat, { image: { url: avatar }, caption }, { quoted: m })
    }
}