const config = require('../../config.js');
const path = require('path');
const { open } = require('lmdb');

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
                await this.bot.put('settings', {
                    mode: 'public', // public or private
                })
            }

            console.log('Databases initialized successfully');
        } catch (error) {
            console.error('Failed to initialize databases:', error);
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