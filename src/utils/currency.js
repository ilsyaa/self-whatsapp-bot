const db = require('./db.js');

module.exports = {
    format: (balance) => {
        return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    subtract: (saldo, jumlah) => {
        saldo = parseInt(saldo);
        jumlah = parseInt(jumlah);
        
        if (saldo < jumlah) {
            return false;
        }
        
        return saldo - jumlah;
    },

    add: (saldo, jumlah) => {
        return parseInt(saldo) + parseInt(jumlah);
    },

    updateBalanceUser(userId, balance) {
        balance = parseInt(balance);
        if (!db.user.get(userId)) return;
        db.update(db.user, userId, { balance });
    }
};
