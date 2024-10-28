const tic = require('../../utils/games/tictactoe.js');
const currency = require('../../utils/currency.js');
const db = require('../../utils/db.js');

module.exports = {
    name : "game-tictactoe",
    description : "Tic Tac Toe",
    cmd : ['tictactoe', 'tic', 'ttt'],
    menu : {
        label : 'games',
        example : 'balance <ai|@mention>'
    },
    run : async({ m, sock }) => {
        if(!m.body.arg) return m._reply(m.lang(msg).ex)
        if(tic.ticMap.has(m.chat)) return m._reply(m.lang(msg).already)
        let bet = m.body.arg.split(' ')[0],
        player1 = m.sender, 
        player2 = m.mentionedJid[0] || 'ai';
        if(!bet || !player1 || !player2) return m._reply(m.lang(msg).ex);
        if(bet == 'all') {
            bet = 500000
        } else {
            bet = bet.replace(/[^0-9]/g, '')
        }
        if(bet < 5000) return m._reply(m.lang(msg).minbet);
        if(bet > 500000) return m._reply(m.lang(msg).maxbet);
        
        if(player2 == 'ai') {
            if (currency.subtract(m.db.user.balance, bet) === false) return m._reply(m.lang(msg).balance.replace('{name}', ''));
            currency.updateBalanceUser(m.sender, currency.subtract(m.db.user.balance, bet));
            const gameState = tic.createGame(m.chat, player1, 'ai@tictactoe', true, bet);
            await m._sendMessage(m.chat, { 
                text: `TicTacToe Vs AI!\n\n${gameState.board}\n\n\@${player1.split('@')[0]} turn!`,
                mentions: [player1]
            });
        } else {
            const opponent = m.mentionedJid[0];
            if (!opponent) return m._reply(m.lang(msg).ex);
            const dbp2 = db.user.get(opponent);
            if(!dbp2) return m._reply(m.lang(msg).unreg);

            // cek saldo player1
            if (currency.subtract(m.db.user.balance, bet) === false) return m._reply(m.lang(msg).balance.replace('{name}', m.db.user.name + ' '));
            // cek saldo player2
            if (currency.subtract(dbp2.balance, bet) === false) return m._reply(m.lang(msg).balance.replace('{name}', dbp2.name + ' '));

            tic.createGame(m.chat, m.sender, opponent, false, bet);
            
            await m._sendMessage(m.chat, { 
                text: m.lang(msg).reqApprove.replace('{player1}', m.sender.split('@')[0]).replace('{player2}', opponent.split('@')[0]).replace('{balance}', currency.format(bet)),
                mentions: [opponent, m.sender]
            });
        }
    }
}

const msg = {
    id: {
        ex: 'Cara bermain, tentukan ingin lawan siapa.\n▷ Lawan AI: {prefix}tic `balance` `ai`\n▷ Lawan orang: {prefix}tic `balance` `@mention`\n\nKeterangan:\n- *balance*: Jumlah taruhan.\n- *@mention*: Tag anggota yang ingin di lawan.\n',
        minbet: 'Jumlah taruhan minimal 5000.',
        maxbet: 'Jumlah taruhan maksimal 500.000.',
        balance: 'Saldo {name}tidak mencukupi.',
        already: 'Ada permainan sedang berlangsung.\nSelesaikan permainan sebelumnya terlebih dahulu.\nAtau ketik endgame untuk mengakhiri permainan.',
        unreg: 'Orang yang anda tantang belum terdaftar.\nSilahkan minta orang yang anda tantang mengetik {prefix}reg `nama`, jika sudah silahkan anda tantang kembali.',
        reqApprove: '@{player2}, kamu ditantang bermain TicTacToe oleh @{player1} dengan taruhan {balance}.\nKetik `accept` untuk menerima, atau `reject` untuk menolak.',
    },
    en: {
        ex: 'Usage: {prefix}tic `balance` `@mention` or {prefix}tic `balance` `ai`\n\nNote:\n- *balance*: Bet amount.\n- *@mention*: Mention the player you want to play against.\n',
        minbet: 'Minimal bet 5000.',
        maxbet: 'Maximal bet 500.000.',
        balance: 'Balance {name} not enough.',
        already: 'There is a game in progress.\nFinish the previous game first.\nOr type endgame to finish the game.',
        unreg: 'The person you challenged is not registered.\nPlease ask the person you challenged to type {prefix}reg `name`, if already please challenge again.',
        reqApprove: '@{player2}, you have challenged TicTacToe game by @{player1} with bet {balance}.\nType `accept` to accept, or `reject` to reject.',
    }
}