module.exports = async (sock) => {
    sock.public = true
    require('./onMessageUpsert.js')(sock)
    require('./onGroupParticipantUpdate.js')(sock)
}