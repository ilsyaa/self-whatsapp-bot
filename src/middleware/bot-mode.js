module.exports = {
    handdler : async (sock, m, $next) => {
        if(!m.senderIsOwner && m.db.bot.mode == 'private') {
            throw {
                break: true, 
                continueCommand: false, 
                message: 'Bot hanya dapat merespon ke owner',
                hideLogs: true
            };
        }
        return $next;
    }
}