const jwt = require('jwt-simple');
const moment = require('moment');

const key = '@@=awesome-key-to-encrpy-515151515-@@!!';

const createToken = (user) => {
    const payload = {
        _id: user.id,
        username: user.username,
        email: user.email,
        iat: moment().unix(),
        exo: moment().add(7, 'days').unix()
    }

    return jwt.encode(payload, key);
}

const verifyToken = (token) => {
    return jwt.decode(token, key);
}

module.exports = {
    createToken,
    verifyToken
}