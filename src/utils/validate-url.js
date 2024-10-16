const validateUrl = (urlString) => {
    try {
        new URL(urlString);
        return true; // URL valid
    } catch (e) {
        return false; // URL tidak valid
    }
};

module.exports = validateUrl