const tic = require('../utils/games/tictactoe.js');
const currency = require('../utils/currency.js');
const db = require('../utils/db.js');
const exp = require('../utils/exp.js');

module.exports = {
    handler : async (sock, m, $next) => {
        if(m.fromMe) return $next
        if (m.body.commandWithoutPrefix === 'move') {
            if(!tic.ticMap.has(m.chat)) return $next
            const gameState = tic.getGameState(m.chat);
            if(gameState.status !== 'playing') return $next
            if(gameState.players.X != m.sender) {
                if(gameState.players.O != m.sender) return $next
            }
            const position = m.body.arg.replace(/[^0-9]/g, '');
            const result = tic.makeMove(m.chat, m.sender, position, m.lang(msg));
            if (result.error) return await m._reply(result.error);

            let message = `_@${gameState.players.X.split('@')[0]} vs @${gameState.players.O.split('@')[0]}_\n`;
            message += `Tictactoe bet *${currency.format(gameState.bet)}*\n\n`;
            message += `${result.board}\n\n`

            if (result.status === 'won') {
                message += `_🎉 @${m.sender.split('@')[0]} Win!_`;
                currency.updateBalanceUser(m.sender, currency.add(m.db.user.balance, parseInt(gameState.bet) * 2));
                await m._sendMessage(m.chat, { 
                    text: message,
                    mentions: [gameState.players.X, gameState.players.O]
                });
                tic.endGame(m.chat);
                return;
            } 
            
            if (result.status === 'draw') {
                message += `_😅 Game Tie!_`;
                const dbp1 = db.user.get(gameState.players.X); // player1
                const dbp2 = db.user.get(gameState.players.O); // player2
                currency.updateBalanceUser(gameState.players.X, currency.add(dbp1.balance, gameState.bet));
                if(dbp2) {
                    currency.updateBalanceUser(gameState.players.O, currency.add(dbp2.balance, gameState.bet));
                }
                await m._sendMessage(m.chat, { 
                    text: message
                });
                tic.endGame(m.chat);
                return;
            }

            if (gameState.isBotGame && result.currentPlayer === gameState.players.O) {
                setTimeout(async () => {
                    const botResult = tic.AIMove(m.chat);
                    
                    let botMessage = `Tictactoe bet *${currency.format(gameState.bet)}*\n`
                    botMessage += `_Vs AI_\n\n`;
                    botMessage += `${botResult.board}\n\n`;
                    if (botResult.status === 'won') {
                        botMessage += `_🤖 AI Win!_`;
                        tic.endGame(m.chat);
                    } else if (botResult.status === 'draw') {
                        const dbp1 = db.user.get(gameState.players.X); // player1
                        currency.updateBalanceUser(gameState.players.X, currency.add(dbp1.balance, gameState.bet));
                        botMessage += `_😅 Game Tie!_`;
                        tic.endGame(m.chat);
                    } else {
                        botMessage += `_@${m.sender.split('@')[0]} turn!_`;
                    }

                    await m._sendMessage(m.chat, { 
                        text: botMessage,
                        mentions: [m.sender]
                    });
                }, 1000);
            } else {
                // Mode multiplayer
                message += `_@${result.currentPlayer.split('@')[0]} turn!_`;
                await m._sendMessage(m.chat, { 
                    text: message,
                    mentions: [gameState.players.X, gameState.players.O]
                });
            }
        }

        if (m.body.commandWithoutPrefix === 'accept') {
            if(!tic.ticMap.has(m.chat)) return $next
            const gameState = tic.getGameState(m.chat);
            if(gameState.status !== 'waiting') return $next
            if(gameState.players.O != m.sender) return $next
            tic.ticMap.get(m.chat).status = 'playing';
            let message = `_@${gameState.players.X.split('@')[0]} vs @${gameState.players.O.split('@')[0]}_\n`;
            message += `Tictactoe bet *${currency.format(gameState.bet)}*\n\n`;
            message += `${gameState.board}\n\n`
            message += `_Giliran: @${gameState.currentPlayer.split('@')[0]}_`;
            const dbp1 = db.user.get(gameState.players.X); // player1
            if (currency.subtract(dbp1.balance, gameState.bet) === false) return m._reply(m.lang(msg).balance.replace('{name}', dbp1.name));
            if (currency.subtract(m.db.user.balance, gameState.bet) === false) return m._reply(m.lang(msg).balance.replace('{name}', m.db.user.name));
            currency.updateBalanceUser(gameState.players.X, currency.subtract(dbp1.balance, gameState.bet));
            currency.updateBalanceUser(m.sender, currency.subtract(m.db.user.balance, gameState.bet));
            exp.add(m.sender, exp.random(1, 10));
            exp.add(gameState.players.X, exp.random(1, 10));
            await m._sendMessage(m.chat, { 
                text: message,
                mentions: [gameState.players.X, gameState.players.O]
            });
        }

        if (m.body.commandWithoutPrefix === 'reject') {
            if(!tic.ticMap.has(m.chat)) return $next
            const gameState = tic.getGameState(m.chat);
            if(gameState.status !== 'waiting') return $next
            if(gameState.players.O != m.sender) return $next
            tic.endGame(m.chat);
            m._reply(m.lang(msg).reject);
        }
    
        if (m.body.commandWithoutPrefix === 'endgame') {
            if(!tic.ticMap.has(m.chat)) return $next
            // const gameState = tic.getGameState(m.chat);
            // if (!m.isGroup?.senderIsAdmin) {
            //     if(gameState.players.X != m.sender) {
            //         if(gameState.players.O != m.sender) return $next
            //     }
            // }
            tic.endGame(m.chat);
            m._reply(m.lang(msg).endGame);
        }
        return $next;
    }
}

const msg = {
    id: {
        notYourTurn: '`Bukan giliranmu`',
        invalidPosition: '`Posisi tidak valid`',
        positionAlreadyFilled: '`Posisi sudah diisi`',
        endGame: '`Game berakhir`',
        reject: '`Game ditolak`',
        balance: 'Saldo {name} tidak mencukupi',
    },
    en: {
        notYourTurn: 'It is not your turn',
        invalidPosition: 'Invalid position',
        positionAlreadyFilled: 'Position already filled',
        endGame: 'Game ended',
        reject: 'Game rejected',
        balance: 'Balance {name} not enough',
    }
}

/* 
break:
jika true dia tidak akan menjalankan middleware selanjutnya.
jika false dia tetap akan menjalankan middleware selanjutnya.

continueCommand:
jika true dia akan tetap akan menjalankan command
jika false dia tidak akan menjalankan command

throw {
    break: true,
    continueCommand: false,
    message: 'Kamu sedang timeout di grup ini',
}
*/