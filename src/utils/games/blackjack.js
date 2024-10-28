/*
    #BlackJack Module

    Author : Ilsya
    Github : https://github.com/ilsyaa
    Website : https://ilsya.my.id
*/

const bjMap = new Map();
const suits = ['♠', '♣', '♥', '♦'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function createDeck() {
    const deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ suit, value });
        }
    }
    return shuffle(deck);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
}

// function calculateHandValue(hand) {
//     let value = 0;
//     let aces = 0;

//     for (const card of hand) {
//         if (card.value === 'A') {
//             aces++;
//         } else {
//             value += getCardValue(card);
//         }
//     }

//     // Add aces
//     for (let i = 0; i < aces; i++) {
//         if (value + 11 <= 21) {
//             value += 11;
//         } else {
//             value += 1;
//         }
//     }

//     return value;
// }

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    // Hitung semua kartu kecuali Ace
    for (const card of hand) {
        if (card.value === 'A') {
            aces++;
        } else {
            value += getCardValue(card);
        }
    }

    // Tambahkan nilai untuk setiap Ace
    for (let i = 0; i < aces; i++) {
        if (value + 11 <= 21) {
            value += 11;
        } else {
            value += 1;
        }
    }

    return value;
}

function formatCard(card) {
    return `${card.value}${card.suit}`;
}

function formatHand(hand) {
    return hand.map(formatCard).join(' ');
}

async function addReactions(sock, key, status) {
    if (status === 'hit') {
        await sock.sendMessage(key.remoteJid, {
            react: {
                text: "👊",
                key: key
            }
        });
    }

    if (status === 'stand') {
        await sock.sendMessage(key.remoteJid, {
            react: {
                text: "✋",
                key: key
            }
        });
    }
}

module.exports = {
    bjMap,
    createDeck,
    shuffle,
    calculateHandValue,
    formatCard,
    formatHand,
    addReactions,
    getCardValue
}