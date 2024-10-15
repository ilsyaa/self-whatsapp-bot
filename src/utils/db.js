const config = require('../../config.js');
const path = require('path');
const { open } = require('lmdb');
const log = require('./log.js')
const moment = require('../utils/moment.js')

class DatabaseManager {
    constructor() {
        this.user = null;
        this.group = null;
        this.bot = null;
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

            if(!this.bot.get('settings')) {
                await this.bot.put('settings', config.DATABASE_SCHEMA.bot)
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