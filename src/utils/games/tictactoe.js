const ticMap = new Map();
const emoji = {
    X: '❌',
    O: '⭕',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣'
};

module.exports = {
    ticMap,
    emoji,
    createGame(chatId, player1, player2, isBotGame = false, bet = 0) {
        const gameState = {
            board: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            currentPlayer: player1,
            players: {
                X: player1,
                O: player2
            },
            status: isBotGame ? 'playing' : 'waiting',
            bet,
            isBotGame: isBotGame
        };
        ticMap.set(chatId, gameState);
        return this.getGameState(chatId);
    },
    
    getGameState(chatId) {
        const game = ticMap.get(chatId);
        let boardDisplay = this.getBoardDisplay(game.board);
        return {
            bet: game.bet,
            board: boardDisplay,
            currentPlayer: game.currentPlayer,
            players: game.players,
            status: game.status,
            isBotGame: game.isBotGame
        };
    },
    getBoardDisplay(board) {
        let display = '';
        for (let i = 0; i < 9; i += 3) {
            display += `${this.getEmoji(board[i])}${this.getEmoji(board[i + 1])}${this.getEmoji(board[i + 2])}\n`;
        }
        return display.trim();
    },
    
    getEmoji(value) {
        return this.emoji[value] || value;
    },

    checkWin(board) {
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical
            [0, 4, 8], [2, 4, 6]             // Diagonal
        ];

        return winConditions.some(condition => {
            const [a, b, c] = condition;
            return board[a] === board[b] && board[b] === board[c];
        });
    },

    endGame(chatId) {
        return ticMap.delete(chatId);
    },

    AIMove(chatId) {
        const game = ticMap.get(chatId);
        if (!game || !game.isBotGame) return null;

        // Dapatkan posisi kosong
        const emptyPositions = game.board
            .map((cell, index) => typeof cell === 'number' ? index + 1 : null)
            .filter(pos => pos !== null);

        // Strategi bot:
        // 1. Cek kemungkinan menang
        // 2. Blok kemungkinan lawan menang
        // 3. Ambil tengah jika kosong
        // 4. Ambil sudut kosong
        // 5. Ambil posisi random yang tersedia

        // Coba setiap posisi kosong untuk mencari gerakan menang
        for (let pos of emptyPositions) {
            const testBoard = [...game.board];
            testBoard[pos - 1] = 'O';
            if (this.checkWin(testBoard)) {
                return this.makeMove(chatId, game.players.O, pos);
            }
        }

        // Cek dan blok kemungkinan menang lawan
        for (let pos of emptyPositions) {
            const testBoard = [...game.board];
            testBoard[pos - 1] = 'X';
            if (this.checkWin(testBoard)) {
                return this.makeMove(chatId, game.players.O, pos);
            }
        }

        // Ambil posisi tengah jika kosong
        if (emptyPositions.includes(5)) {
            return this.makeMove(chatId, game.players.O, 5);
        }

        // Ambil sudut kosong
        const corners = [1, 3, 7, 9].filter(corner => emptyPositions.includes(corner));
        if (corners.length > 0) {
            const corner = corners[Math.floor(Math.random() * corners.length)];
            return this.makeMove(chatId, game.players.O, corner);
        }

        // Ambil posisi random
        const randomPos = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
        return this.makeMove(chatId, game.players.O, randomPos);
    },

    makeMove(chatId, player, position, msg) {
        const game = ticMap.get(chatId);
        if (player !== game.currentPlayer) return { error: msg.notYourTurn };
        if (position < 1 || position > 9) return { error: msg.invalidPosition };
        
        const index = position - 1;
        if (typeof game.board[index] !== 'number') return { error: msg.positionAlreadyFilled };

        // Menentukan simbol pemain
        const symbol = game.players.X === player ? 'X' : 'O';
        game.board[index] = symbol;

        // Cek kondisi menang
        if (this.checkWin(game.board)) {
            game.status = 'won';
            return {
                ...this.getGameState(chatId),
                winner: player
            };
        }

        // Cek kondisi seri
        if (!game.board.some(cell => typeof cell === 'number')) {
            game.status = 'draw';
            return this.getGameState(chatId);
        }

        // Ganti giliran
        game.currentPlayer = (game.currentPlayer === game.players.X) ? game.players.O : game.players.X;
        return this.getGameState(chatId);
    }
    
}