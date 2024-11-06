const db = require('../db.js');
const crypto = require('crypto');
const moment = require('../moment.js');
const currency = require('../currency.js');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = moment();
    }
}

class BlockchainDB {
    constructor() {
        this.db = db.blockchain;
    }

    async getMetadata() {
        return await this.db.metadata.get('blockchainInfo');
    }
    async transfer(fromAddress, toAddress, amount) {
        try {
            // Validasi saldo
            const senderBalance = await this.getBalance(fromAddress);
            if (amount > senderBalance) {
                throw new Error('Saldo tidak cukup!');
            }

            // Update saldo pengirim dan penerima
            await this.updateBalance(fromAddress, -amount);
            await this.updateBalance(toAddress, amount);

            // Buat ID transaksi
            const txId = crypto.randomBytes(16).toString('hex');
            
            // Simpan history transaksi
            await this.db.txHistory.put(txId, {
                id: txId,
                from: fromAddress,
                to: toAddress,
                amount: amount,
                timestamp: moment(),
                type: 'transfer'
            });

            // Update total transaksi
            const metadata = await this.getMetadata();
            await this.db.metadata.put('blockchainInfo', {
                ...metadata,
                totalTransactions: metadata.totalTransactions + 1
            });

            return {
                success: true,
                txId,
                from: fromAddress,
                to: toAddress,
                amount: amount
            };
        } catch (error) {
            throw error;
        }
    }

    // Fungsi mining terpisah
    async mine(minerAddress) {
        // Validasi maximum supply
        const metadata = await this.getMetadata();
        const currentReward = await this.calculateCurrentReward();
        
        if (metadata.currentSupply + currentReward > metadata.maxSupply) {
            throw new Error('Maksimum supply tercapai!');
        }

        // Update saldo miner
        await this.updateBalance(minerAddress, currentReward);

        // Update metadata
        await this.db.metadata.put('blockchainInfo', {
            ...metadata,
            currentSupply: metadata.currentSupply + currentReward,
            blocksMined: metadata.blocksMined + 1
        });

        // Catat mining reward sebagai transaksi
        const txId = crypto.randomBytes(16).toString('hex');
        await this.db.txHistory.put(txId, {
            id: txId,
            from: 'SYSTEM',
            to: minerAddress,
            amount: currentReward,
            timestamp: moment(),
            type: 'mining_reward'
        });

        return {
            success: true,
            reward: currentReward,
            remainingSupply: metadata.maxSupply - (metadata.currentSupply + currentReward),
            blocksUntilHalving: metadata.blockRewardHalvingInterval - ((metadata.blocksMined + 1) % metadata.blockRewardHalvingInterval)
        };
    }

    async getBalance(address) {
        return await this.db.balances.get(address) || 0;
    }

    async updateBalance(address, amount, txn = null) {
        const db = txn || this.db.balances;
        const currentBalance = await this.getBalance(address);
        await db.put(address, currentBalance + amount);
    }

    async getTransactionHistory(address, limit = 10) {
        const history = [];
        for await (const { value } of this.db.txHistory.getRange({ reverse: true })) {
            if (value.from === address || value.to === address) {
                history.push(value);
                if (history.length >= limit) break;
            }
        }
        return history;
    }

    async calculateCurrentReward() {
        const metadata = await this.getMetadata();
        const halvings = Math.floor(metadata.blocksMined / metadata.blockRewardHalvingInterval);
        return metadata.miningReward / Math.pow(2, halvings);
    }

    async getCoinStats() {
        const metadata = await this.getMetadata();
        return {
            currentSupply: metadata.currentSupply,
            maxSupply: metadata.maxSupply,
            remainingSupply: metadata.maxSupply - metadata.currentSupply,
            currentReward: await this.calculateCurrentReward(),
            blocksMined: metadata.blocksMined,
            blocksUntilHalving: metadata.blockRewardHalvingInterval - (metadata.blocksMined % metadata.blockRewardHalvingInterval)
        };
    }

    async getAllBalances(opt = {}) {
        const balances = {};
        for await (const { key, value } of this.db.balances.getRange(opt)) {
            balances[key] = value;
        }
        return balances;
    }
}

module.exports = {
    BlockchainDB,
    Transaction,
};