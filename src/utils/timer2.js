const moment = require('./moment.js');

module.exports = time2 = () => {
    const time2 = moment().tz('Asia/Jakarta').format('HH:mm:ss')
    if (time2 < "23:59:00") {
        var ucapanWaktu = 'Malam 🏙️'
    }
    if (time2 < "19:00:00") {
        var ucapanWaktu = 'Petang 🌆'
    }
    if (time2 < "18:00:00") {
        var ucapanWaktu = 'Sore 🌇'
    }
    if (time2 < "15:00:00") {
        var ucapanWaktu = 'Siang 🌤️'
    }
    if (time2 < "10:00:00") {
        var ucapanWaktu = 'Pagi 🌄'
    }
    if (time2 < "05:00:00") {
        var ucapanWaktu = 'Subuh 🌆'
    }
    if (time2 < "03:00:00") {
        var ucapanWaktu = 'Tengah Malam 🌃'
    }

    return ucapanWaktu
}