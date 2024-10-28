const {
    bjMap,
    formatCard,
    formatHand,
    calculateHandValue,
    addReactions
} = require('../utils/blackjack.js');
const currency = require('../utils/currency.js');

module.exports = {
    handler : async (sock, m, $next) => {
        if(m.fromMe) return $next
        try {
            const game = bjMap.get(m.sender)
            if(!game || game.status !== 'playing') return $next

            if (m.body.commandWithoutPrefix === 'hit') {
                addReactions(sock, m.key, 'hit');
                game.playerHand.push(game.deck.pop());
                const handValue = calculateHandValue(game.playerHand);
                
                if (handValue > 21) {
                    game.status = 'finished';
                    let text = `_*${m.db.user.name}*, you bet *${currency.format(game.bet)}* to play blackjack._\n\n`;
                    text += `> *Your hand*: _${formatHand(game.playerHand)}_  *\`[${handValue}]\`*\n\n`;
                    text += `🎲 ~ \`You lose!\`\n\n`;
                    text += `Type !blackjack to play again.`;
                    await m._sendMessage(m.chat, { text }, { quoted: m });
                    bjMap.delete(m.sender);
                } else {
                    let text = `_*${m.db.user.name}*, you bet *${currency.format(game.bet)}* to play blackjack._\`\n\n`;
                    text += `> *Your hand*: _${formatHand(game.playerHand)}_  *\`[${handValue}]\`*\n`;
                    text += `> *Dealer's hand*: _${formatCard(game.dealerHand[0])}_  *\`[${calculateHandValue(game.dealerHand)}+?]\`*\n\n`;
                    text += m.lang(msg).desc;
                    await m._sendMessage(m.chat, { text }, { quoted: m });
                }
            }

            if (m.body.commandWithoutPrefix === 'stand') {
                addReactions(sock, m.key, 'stand');
                let dealerValue = calculateHandValue(game.dealerHand);
                while (dealerValue < 17) {
                    game.dealerHand.push(game.deck.pop());
                    dealerValue = calculateHandValue(game.dealerHand);
                }
                const playerValue = calculateHandValue(game.playerHand);
                let winer;

                if (dealerValue > 21) {
                    winer = 'You win! Dealer bust! 🎉';
                    currency.updateBalanceUser(m.sender, currency.add(m.db.user.balance, parseInt(game.bet) * 2));
                } else if (dealerValue > playerValue) {
                    winer = 'Dealer wins! 🤓';
                } else if (playerValue > dealerValue) {
                    winer = 'You win! 🎉';
                    currency.updateBalanceUser(m.sender, currency.add(m.db.user.balance, parseInt(game.bet) * 2));
                } else {
                    winer = "It's a tie! 🤝";
                    currency.updateBalanceUser(m.sender, currency.add(m.db.user.balance, parseInt(game.bet)));
                }

                let text = `_*${m.db.user.name}*, you bet *${currency.format(game.bet)}* to play blackjack._\n\n`;
                text += `> *Your hand*: _${formatHand(game.playerHand)}_  *\`[${playerValue}]\`*\n`;
                text += `> *Dealer's hand*: _${formatHand(game.dealerHand)}_  *\`[${dealerValue}]\`*\n\n`;
                text += `🎲 ~ \`${winer}\`\n\n`;
                text += '```Type !blackjack to play again.```';
                await m._sendMessage(m.chat, { text }, { quoted: m });
                bjMap.delete(m.sender);
            }

        } catch (error) {
            console.error(error)
        }

        return $next;
    }
}

const msg = {
    id: {
        desc: '```Tipe``` *`hit`* ```untuk mengambil kartu lain atau``` *`stand`* ```untuk mempertahankan kartu Anda saat ini.```'
    },
    en: {
        desc: '```Type``` *`hit`* ```to take another card or``` *`stand`* ```to keep your current hand.```'
    }
}