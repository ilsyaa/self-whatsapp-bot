const moment = require('moment-timezone')

module.exports = time2 = () => {
    const time2 = moment().tz('Asia/Jakarta').format('HH:mm:ss')
    if (time2 < "23:59:00") {
        var ucapanWaktu = 'Selamat Malam 🏙️'
    }
    if (time2 < "19:00:00") {
        var ucapanWaktu = 'Selamat Petang 🌆'
    }
    if (time2 < "18:00:00") {
        var ucapanWaktu = 'Selamat Sore 🌇'
    }
    if (time2 < "15:00:00") {
        var ucapanWaktu = 'Selamat Siang 🌤️'
    }
    if (time2 < "10:00:00") {
        var ucapanWaktu = 'Selamat Pagi 🌄'
    }
    if (time2 < "05:00:00") {
        var ucapanWaktu = 'Selamat Subuh 🌆'
    }
    if (time2 < "03:00:00") {
        var ucapanWaktu = 'Selamat Tengah Malam 🌃'
    }

    return ucapanWaktu
}