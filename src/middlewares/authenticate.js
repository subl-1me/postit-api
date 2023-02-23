const { verifyToken } = require('../helpers/jwt');
const moment = require('moment');
const UserError = require('../errors/UserError');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) { 
        throw new UserError(301, 'Unauthorized.', 400) 
    }

    try{
        const decodedToken = verifyToken(token);
        let now = moment().unix();
        if(now > decodedToken.exo){ // is token expired?
            throw new UserError(302, 'Expired token.', 400);
        }

        next();
    }catch(err){
        throw new Error('Error trying to decode token: ' + err.message);
    }
}

module.exports = authenticate;