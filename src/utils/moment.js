const moment = require('moment-timezone');
moment.tz.setDefault(process.env.TZ || 'Asia/Jakarta');

module.exports = moment;