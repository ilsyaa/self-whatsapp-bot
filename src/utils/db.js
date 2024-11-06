const config = require('../../config.js');
const { default: axios } = require('axios')
const path = require('path');
const { open } = require('lmdb');
const log = require('./log.js')
const Block = require('./blockchain/block.js');
const moment = require('./moment.js');

class DatabaseManager {
    constructor() {
        this.user = null;
        this.group = null;
        this.bot = null;
        this.blockchain = {
            mine: null,
            chain: null,
            balances: null,
            metadata: null,
            pendingTx: null,
            txHistory: null
        };
    }

    async init() {
        try {
            this.user = open({
                path: path.join(config.STORAGE_DB, 'user'),
            });
            
            this.group = open({
                path: path.join(config.STORAGE_DB, 'group'),
            });

            this.bot = open({
                path: path.join(config.STORAGE_DB, 'bot'),
            });

            // blockchain ------------------------
            this.blockchain.mine = open({
                path: path.join(config.STORAGE_DB, 'blockchain/mine'),
            });
            this.blockchain.chain = open({
                path: path.join(config.STORAGE_DB, 'blockchain/chain'),
            });
            this.blockchain.balances = open({
                path: path.join(config.STORAGE_DB, 'blockchain/balances'),
            });
            this.blockchain.metadata = open({
                path: path.join(config.STORAGE_DB, 'blockchain/metadata'),
            });
            this.blockchain.pendingTx = open({
                path: path.join(config.STORAGE_DB, 'blockchain/pendingtx'),
            });
            this.blockchain.txHistory = open({
                path: path.join(config.STORAGE_DB, 'blockchain/txhistory'),
            });
            
            const metadata = await this.blockchain.metadata.get('blockchainInfo');
            if (!metadata) {
                // Inisialisasi blockchain baru
                await this.blockchain.metadata.put('blockchainInfo', config.DATABASE_SCHEMA.blockchain);

                // Buat genesis block
                const genesisBlock = new Block(moment(), [], "0");
                await this.blockchain.chain.put(0, genesisBlock);
            }
            // blockchain ------------------------
            
            if(!this.bot.get('settings')) {
                const icon = await axios.get('https://i.pinimg.com/enabled_hi/1200x/6b/e2/b3/6be2b369fd5bca46e103af8f99263962.jpg', { responseType: 'arraybuffer' }).then(res => res.data)
                await this.bot.put('settings', { ...config.DATABASE_SCHEMA.bot, ...{ icon } })
            }

            log.info(`Databases initialized successfully.`)
        } catch (error) {
            log.error(`Error initializing databases = ${error}.`)
            throw error;
        }
    }

    async update(db, key, value) {
        try {
            await db.put(key, {
                ...db.get(key),
                ...value,
            });
        } catch (error) {
            console.error('Error updating database:', error);
            throw error;
        }
    }

    async close() {
        try {
            if (this.user) await this.user.close();
            if (this.group) await this.group.close();
            if (this.bot) await this.bot.close();
            console.log('Databases closed successfully');
        } catch (error) {
            console.error('Error closing databases:', error);
            throw error;
        }
    }
}

module.exports = new DatabaseManager();