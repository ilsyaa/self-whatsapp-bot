const db = require('./db.js');
const moment = require('./moment.js');

module.exports = {
    random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
    add: (id, amount) => {
        let user = db.user.get(id);
        if (!user) return false;
        db.update(db.user, id, { exp: parseInt(user.exp) + parseInt(amount), updated_at: moment() });
    }
}