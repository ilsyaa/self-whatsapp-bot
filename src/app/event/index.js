module.exports = async (sock) => {
    sock.public = false
    require('./onMessageUpsert.js')(sock)
    require('./onGroupParticipantUpdate.js')(sock)
}