module.exports = async function lang(m) {
    if(m.isGroup && m.db.group?.lang) return m.db.group.lang
    if(m.bot.lang) return m.bot.lang
    return 'id'
}