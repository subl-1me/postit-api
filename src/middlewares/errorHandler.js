const UserError = require('../errors/UserError');
const AuthError = require('../errors/AuthenticationError');

const errorHandler = (error, req, res, next) => {
    console.log(error);
    if(error instanceof UserError){
        return res.status(error.status).send({
            status: 'error',
            message: error.message,
            errorCode: error.errorCode,
            invalidProperties: error.invalidProperties
        })
    }

    if(error instanceof AuthError){
        return res.status(error.statusCode).send({
            status: 'error',
            message: error.message,
            errorCode: error.errorCode,
        })
    }

    if(error.sqlMessage){
        return res.status(500).send({
            status: 'sqlError',
            code: error.code,
            sqlMessage: error.sqlMessage
        })
    }

    return res.status(500).send({
        status: 'serverError',
        message: 'Unexpected server error',
        err: error.message
    })
}

module.exports = errorHandler;