const UserError = require('../errors/UserError');

const userDataValidator = (req, res, next) => {
    const user = req.body;
    if(typeof user.username !== 'string'){
        throw new UserError(310, 'Expected STRING TYPE on user.username: ' + user.username, 300);
    }
    if(typeof user.email !== 'string'){
        throw new UserError(311, 'Expected STRING TYPE on user.email: ' + user.email, 300);
    }

    if(typeof user.password !== 'string'){
        // just convert to string to avoid problems with Bcrypt hashing
        user.password = String(user.password);
        req.body = user;
    }

    next();
}

module.exports = userDataValidator;