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
        console.log(update)
    }

    sock.ev.on('contacts.upsert', updateName)
    sock.ev.on('groups.update', updateName)
    sock.ev.on('contacts.set', updateName)
}