const moment = require('./src/utils/moment.js')

module.exports = {
    /*
        #Database Schema
        Default Schema and value database.

        Important For Bot Schema:
        - You can change the bot settings via commands, 
          or you can make changes manually via the configuration with the condition that after making changes you need to run the /reset-db-bot command.
    */
    DATABASE_SCHEMA: {
        bot : {
            mode: 'public',
            lang: 'id',
            prefix: ['/', '.', '!'],
            owners: {
                '6285174902345': 'Ilsya',
                // '628xxx': 'Name',
            },
            exif: {
                pack: "BOT 6285731618404",
                author: "Owner Ilsya",
            },
            created_at: moment(),
            updated_at: moment(),
        },
        user : {
            plan: "free", // free or pro
            plan_expire: false, // false = unlimited
            limit: 20, // false -> unlimited
            exp: 0,
            balance: 1000000,
            blacklist: false, // false = not in blacklist, true = in blacklist permanently, timestamp = in blacklist for some time
            blacklist_reason: '', // reason for blacklist
            updated_at: moment(), // update every time using bot
            created_at: moment(), // create time
        },
        group : {
            mode: 'admin-only', // admin-only or all
            antilink: false,
            nsfw: false,
            welcome: false,
            welcome_message: null,
            timeouts: {},
            activity_record: false,
            member_activity: {},
            updated_at: moment(),
            created_at: moment(),
        },
        blockchain: {
            difficulty: 2,
            miningReward: 1000000, // 1jt
            maxSupply: 100000000000,// 1 miliar
            currentSupply: 0,
            blocksMined: 0,
            blockRewardHalvingInterval: 1000,
            totalTransactions: 0
        }
    },
}