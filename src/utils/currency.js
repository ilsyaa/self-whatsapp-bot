module.exports = {
    format: (balance) => {
        return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    subtract: (saldo, jumlah) => {
        if (parseInt(saldo) < parseInt(jumlah)) {
            return false;
        }
        return parseInt(saldo) - parseInt(jumlah);
    },

    add: (saldo, jumlah) => {
        return parseInt(saldo) + parseInt(jumlah);
    }
};
