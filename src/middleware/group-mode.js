module.exports = {
    handler : async (sock, m, $next) => {
        if (m.isGroup && !m.senderIsOwner && m.db.group.mode === 'admin-only' && !m.isGroup.senderIsAdmin) {
            throw {
                break: true, 
                continueCommand: false, 
                message: 'Bot hanya dapat merespon ke admin',
                hideLogs: true 
            };
        }
        return $next;
    }
}