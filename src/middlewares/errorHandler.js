const UserError = require('../errors/UserError');

const errorHandler = (error, _req, res, next) => {
    console.log('inside error handler');
    if(error instanceof UserError){
        return res.send({
            status: error.statusCode,
            message: error.message,
            errorCode: error.errorCode,
            invalidProperties: error.invalidProperties
        })
    }

    console.log(error);
    return res.status(500).send({
        message: 'Unexpected server error',
        err: error.message
    })
}

module.exports = errorHandler;