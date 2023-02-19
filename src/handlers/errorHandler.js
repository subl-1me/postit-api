const UserError = require('../errors/UserError');

const errorHandler = (error, res, _req, next) => {
    if(error instanceof UserError){
        console.log('Es un user error');
        return res.send({
            status: err.statusCode,
            message: err.message,
            errorCode: err.errorCode
        })
    }
}

module.exports = errorHandler;