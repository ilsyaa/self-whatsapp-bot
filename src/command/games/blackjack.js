const {
    bjMap,
    createDeck,
    formatCard,
    formatHand,
    calculateHandValue,
} = require('../../utils/blackjack.js');

module.exports = {
    name : "game-blackjack",
    description : "Game Blackjack",
    cmd : ['bj', 'blackjack'],
    menu : {
        label : 'games',
        example : '<all|number>'
    },
    run : async({ m, sock }) => {
        if(m.fromMe) return;
        if(bjMap.has(m.sender)) return m._reply(m.lang(msg).exist);
        if(!m.body.arg) return m._reply(m.lang(msg).ex);

        const deck = createDeck();
        const playerHand = [deck.pop(), deck.pop()];
        const dealerHand = [deck.pop(), deck.pop()];

        let response = `\`${m.db.user.name}, you bet 250.000 to play blackjack.\`\n\n`;
        response += `*Your hand*: _${formatHand(playerHand)}_  *\`[${calculateHandValue(playerHand)}]\`*\n`;
        response += `*Dealer's visible card*: _${formatCard(dealerHand[0])}_  *\`[${calculateHandValue(dealerHand)}+?]\`*\n\n`;
        response += `Type hit to take another card or stand to keep your current hand.`;

        const sent = await m._sendMessage(m.chat, { text: response }, { quoted: m });

        bjMap.set(m.sender, {
            deck,
            playerHand,
            dealerHand,
            status: 'playing',
            messageKey : sent.key,
        });
    }
}

const msg = {
    id: {
        ex: 'Penggunaan {prefix}bj <all|number>',
        exist: 'Permainan Blackjack sebelumnya sedang berlangsung.',
    },
    
}