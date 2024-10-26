const db = require("../../utils/db.js")

module.exports = {
    name : "bot-clear",
    description : "Clear Cache Bot",
    cmd : ['clear'],
    run : async({ m, sock }) => {
        try {
            if(!m.senderIsOwner) return
            
            const groups = await sock.groupFetchAllParticipating()
            console.log(groups);
            
        } catch(error) {
            await m._reply(error.message)
        }
    }
}