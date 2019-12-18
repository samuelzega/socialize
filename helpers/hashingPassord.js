const crypto = require('crypto');

function hashingPassword(secret, password) {
    const hash = crypto.createHmac('sha256', secret)
                    .update(password)
                    .digest('hex');
    return hash
}

module.exports = hashingPassword