module.exports = {
    handler : async (sock, m, $next, command) => {
        if(m.fromMe) return $next
        if(!command) return $next
        if(!command.limit) return $next
        if(m.db.user?.limit == 'unlimited') return $next

        if (parseInt(m.db.user.limit) < command.limit) {
            m._reply(`Limit tidak mencukupi. Kamu butuh ${command.limit} limit.\nKetik \`${m.body.prefix}buylimit\` untuk membeli limit, atau klaim limit harian dengan \`${m.body.prefix}daily\`.`);
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