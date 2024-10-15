const db = require('../../utils/db.js')
const moment = require('../../utils/moment.js')

module.exports = async (sock) => {
    sock.public = false
    require('./onMessageUpsert.js')(sock)
    require('./onGroupParticipantUpdate.js')(sock)

    sock.ev.on("call", async (callsList) => {
        for (const call of callsList) {
            await sock.rejectCall(call.id, call.from);
        }
    });

    const updateName = async (update) => {
        //  { id: 'abc@s.whatsapp.net', name: 'name' },
    }

    sock.ev.on('contacts.upsert', updateName)
    sock.ev.on('contacts.set', updateName)
    
    sock.ev.on('groups.update', async (update) => {
        for (const group of update) {
            await db.update(db.group, group.id, {
                name: group.subject,
                updated_at: moment()
            })
        }
    })
}