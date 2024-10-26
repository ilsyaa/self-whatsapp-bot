const db = require("../../utils/db.js")

module.exports = {
    name : "owner-get-group",
    description : "Show All Group",
    cmd : ['getgroup', 'ggroup', 'groups'],
    run : async({ m, sock }) => {
        try {
            if(!m.senderIsOwner) return
            let text = `*\`❖ All Group\`*\n\n`
            let groups = await sock.groupFetchAllParticipating()
            for (let group of Object.values(groups)) {
                text += `▷ *${group.id}* - ${group.subject}\n`
            }
            m._reply(text)
        } catch(error) {
            await m._reply(error.message)
        }
    }
}