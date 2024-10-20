const db = require('../utils/db.js');
const moment = require('../utils/moment.js');

module.exports = {
    handler : async (sock, m, $next) => {
        if(m.fromMe) return $next;
        if(!m.isGroup) return $next;

        let timeouts = { ...m.db.group?.timeouts || {} };
        let hasExpired = false;
        
        for (const [key, value] of Object.entries(timeouts)) {
            if (moment().isAfter(value)) {
                delete timeouts[key];
                hasExpired = true;
            }
        }
        
        if (hasExpired) {
            m.db.group.timeouts = timeouts;
            db.update(db.group, m.isGroup.groupMetadata.id, {
                timeouts
            });
        }
        

        return $next;
    }
}