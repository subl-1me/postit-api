const UserError = require('../errors/UserError');

const errorHandler = (error, req, res, next) => {
    console.log('inside error handler');
    if(error instanceof UserError){
        return res.send({
            status: error.statusCode,
            message: error.message,
            errorCode: error.errorCode,
            invalidProperties: error.invalidProperties
        })
    }

    if(error.sqlMessage){
        return res.status(200).send({
            message: 'Unexpected SQL error',
            sqlErr: error.sqlMessage
        })
    }

    return res.status(500).send({
        message: 'Unexpected server error',
        err: error.message
    })
}

module.exports = errorHandler;