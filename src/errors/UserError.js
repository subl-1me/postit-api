class UserError extends Error{
    constructor(errorCode, message, statusCode, invalidProperties){
        super(message);

        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.invalidProperties = invalidProperties;
    }
}

module.exports = UserError;