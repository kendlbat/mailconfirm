const crypto = require('crypto');

function byText(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

function byMaildata(sender, reciever, subject, date) {
    return byText(sender + reciever + subject + date);
}

module.exports = {
    byText,
    byMaildata
}