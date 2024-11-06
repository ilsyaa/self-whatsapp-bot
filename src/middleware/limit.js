module.exports = {
    handler : async (sock, m, $next, command) => {
        if(m.fromMe) return $next
        if(!command) return $next
        if(!command.limit) return $next
        if(m.db.user?.limit == 'unlimited') return $next

        if (parseInt(m.db.user.limit) < command.limit) {
            m._reply('No enough limit, you need ' + command.limit + ' limit.\nType `'+m.body.prefix+'buylimit` to buy limit.')
            throw {
                break: false,
                continueCommand: false,
                message: 'No enough limit, you need ' + command.limit + ' limit.\nType `'+m.body.prefix+'buylimit` to buy limit.',
                hideLogs: true
            }
        }

        return $next;
    }
}