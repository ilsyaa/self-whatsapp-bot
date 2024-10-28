const {
    bjMap,
    createDeck,
    formatCard,
    formatHand,
    calculateHandValue,
} = require('../../utils/blackjack.js');
const currency = require('../../utils/currency.js');

module.exports = {
    name : "game-blackjack",
    description : "Game Blackjack",
    cmd : ['blackjack', 'bj'],
    menu : {
        label : 'games',
        example : '<all|balance>'
    },
    run : async({ m, sock }) => {
        if(m.fromMe) return;
        if(bjMap.has(m.sender)) return m._reply(m.lang(msg).exist);
        if(!m.body.arg) return m._reply(m.lang(msg).ex);

        let bet = m.body.arg.replace(/[^0-9]/g, '');
        if(m.body.arg == 'all') bet = 250000;
        if(bet < 5000) return m._reply(m.lang(msg).minbet);
        if (currency.subtract(m.db.user.balance, bet) === false) return m._reply(m.lang(msg).balance);
        currency.updateBalanceUser(m.sender, currency.subtract(m.db.user.balance, bet));

        const deck = createDeck();
        const playerHand = [deck.pop(), deck.pop()];
        const dealerHand = [deck.pop(), deck.pop()];

        let response = `_*${m.db.user.name}*, you bet *${currency.format(bet)}* to play blackjack._\n\n`;
        response += `> *Your hand*: _${formatHand(playerHand)}_  *\`[${calculateHandValue(playerHand)}]\`*\n`;
        response += `> *Dealer's visible card*: _${formatCard(dealerHand[0])}_  *\`[${calculateHandValue(dealerHand)}+?]\`*\n\n`;
        response += m.lang(msg).desc;

        const sent = await m._sendMessage(m.chat, { text: response }, { quoted: m });

        bjMap.set(m.sender, {
            deck,
            playerHand,
            dealerHand,
            status: 'playing',
            bet: bet,
            messageKey : sent.key,
        });
    }
}

const msg = {
    id: {
        ex: 'Penggunaan {prefix}bj <all|saldo>',
        exist: 'Permainan Blackjack sebelumnya sedang berlangsung.',
        balance: 'Saldo kamu tidak cukup.',
        minbet: 'Minimal 5.000',
        desc: '```Tipe``` *`hit`* ```untuk mengambil kartu lain atau``` *`stand`* ```untuk mempertahankan kartu Anda saat ini.```'
    },
    en: {
        ex: 'Usage: {prefix}bj <all|balance>',
        exist: 'Blackjack game is already in progress.',
        balance: 'Your balance is not enough.',
        minbet: 'Minimal 5.000',
        desc: '```Type``` *`hit`* ```to take another card or``` *`stand`* ```to keep your current hand.```'
    }
}