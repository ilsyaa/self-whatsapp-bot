const db = require('../../utils/db.js')

module.exports = {
    name : "group-leaderboard",
    description : "Menampilkan leaderboard member group",
    cmd : ['leaderboard', 'top'],
    menu : {
        label : 'group',
        example : 'range'
    },
    run : async({ m, sock }) => {
        try {
            if(!m.isGroup) return
            if(!m.isGroup.senderIsAdmin) return
            if(!m.body.arg) return m._reply(m.lang(msg).ex)

            const leaderboard = Object.entries(m.db?.group?.member_activity)
                .sort(([, a], [, b]) => b - a)
                .slice(0, m.body.arg)
                .map(([member, activity], index) => ({
                    rank: index + 1,
                    member,
                    activity
                }));
            let text;

            text = `*\`❖ Leaderboard Group\`*\n\n`
            for (const { rank, member, activity } of leaderboard) {
                text += `▷ *\`${rank}\`* @${member.split('@')[0]} - *${activity}*\n`
            }

            await m._sendMessage(m.chat, {
                text,
                mentions: [...leaderboard.map(({ member }) => member)]
            }, { quoted: m });

        } catch(error) {
            await m._reply(error.message)
        }
    }
}

const msg = {
    id: {
        ex: 'Penggunaan: {prefix}leaderboard `range`\n\n*Keterangan:*\n- *range*: jumlah yang ingin di tampilkan.',
    },
    en: {
        ex: 'Usage: {prefix}leaderboard `range`\n\n*Description:*\n- *range*: The range you want to keep.',
    }
}
