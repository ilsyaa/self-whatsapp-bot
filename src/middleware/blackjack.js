const {
    bjMap,
    formatCard,
    formatHand,
    calculateHandValue,
    addReactions
} = require('../utils/blackjack.js');

module.exports = {
    handler : async (sock, m, $next) => {
        if(m.fromMe) return $next
        try {
            const game = bjMap.get(m.sender)
            if(!game || game.status !== 'playing') return $next

            if (m.body.command === 'hit') {
                addReactions(sock, m.key, 'hit');
                game.playerHand.push(game.deck.pop());
                const handValue = calculateHandValue(game.playerHand);
                
                if (handValue > 21) {
                    game.status = 'finished';
                    let text = `\`${m.db.user.name}, you bet 250.000 to play blackjack.\`\n\n`;
                    text += `*Your hand*: _${formatHand(game.playerHand)}_  *\`[${handValue}]\`*\n`;
                    text += `🎲 ~ *You lose!*\n\n`;
                    text += `Type !blackjack to play again.`;
                    await m._sendMessage(m.chat, { text }, { quoted: m });
                    bjMap.delete(m.sender);
                } else {
                    let text = `\`${m.db.user.name}, you bet 250.000 to play blackjack.\`\n\n`;
                    text += `*Your hand*: _${formatHand(game.playerHand)}_  *\`[${handValue}]\`*\n`;
                    text += `*Dealer's hand*: _${formatCard(game.dealerHand[0])}_  *\`[${calculateHandValue(game.dealerHand)}+?]\`*\n\n`;
                    text += `Type hit to take another card or stand to keep your current hand.`;
                    await m._sendMessage(m.chat, { text }, { quoted: m });
                }
            }

            if (m.body.command === 'stand') {
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
                } else if (dealerValue > playerValue) {
                    winer = 'Dealer wins! 🤓';
                } else if (playerValue > dealerValue) {
                    winer = 'You win! 🎉';
                } else {
                    winer = "It's a tie! 🤝";
                }

                let text = `\`${m.db.user.name}, you bet 250.000 to play blackjack.\`\n\n`;
                text += `*Your hand*: _${formatHand(game.playerHand)}_  *\`[${playerValue}]\`*\n`;
                text += `*Dealer's hand*: _${formatHand(game.dealerHand)}_  *\`[${dealerValue}]\`*\n\n`;
                text += `🎲 ~ ${winer}\n\n`;
                text += `Type !blackjack to play again.`;
                await m._sendMessage(m.chat, { text }, { quoted: m });
                bjMap.delete(m.sender);
            }

        } catch (error) {
            console.error(error)
        }

        return $next;
    }
}