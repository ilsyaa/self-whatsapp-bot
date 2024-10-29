// Activity Record For Member Group
const db = require("../utils/db.js")
const moment = require("../utils/moment.js")
const lastMessageMap = new Map();
const spamInterval = 60000; // milliseconds
const exp = require('../utils/exp.js');

module.exports = {
    handler : async (sock, m, $next) => {
        if(m.fromMe) return $next
        if(!m.isGroup) return $next
        if(!m.db?.group?.activity_record) return $next

        const key = `${m.isGroup.groupMetadata.id}-${m.sender}`;
        const currentTime = moment();

        for (const [k, lastMessageTime] of lastMessageMap) {
            if (currentTime.diff(lastMessageTime, 'milliseconds') >= spamInterval) {
                lastMessageMap.delete(k);
            }
        }

        if(lastMessageMap.has(key)) {
            const lastMessageTime = lastMessageMap.get(key);
            if(currentTime.diff(lastMessageTime, 'milliseconds') < spamInterval) {
                // console.log(`Spam detected: ${key} - expired in ${currentTime.diff(lastMessageTime, 'seconds')} seconds`);
                return $next;
            }
        }

        lastMessageMap.set(key, currentTime);

        try {
            exp.add(m.sender, exp.random(1, 5));
            db.update(db.group, m.isGroup.groupMetadata.id, {
                member_activity: {
                    ...(m.db.group.member_activity || {}),
                    [m.sender]: (m.db.group.member_activity?.[m.sender] || 0) + 1
                },
                updated_at: moment()
            });
        } catch(err) {
            console.error("Middleware Activity Record Error: "+err)
        }
        
        return $next;
    }
}