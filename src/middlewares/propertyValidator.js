const ValidatorError = require('../errors/ValidatorError');

const validModels = [
    'user',
    'post',
    'comment'
]

const userProperties = [
    '_id',
    'username',
    'email'
]

const postProperties = [

]

const commentProperties = [

]

/**
 * @description It handles the model validator process
 * @param {*} body Model/Schema body
 */
const validator = (req, res, next) => {
    const { body } = req;
    const properties = Object.getOwnPropertyNames(body);
    const actualModel = getModel(req.originalUrl); // Get the model we're working for

    if(actualModel === 'user'){ validateModel(userProperties, properties) }
    if(actualModel === 'post') { validateModel(postProperties, properties) }
    if(actualModel === 'comment') { validateModel(commentProperties, properties) }

    next();
}

/**
 * @description Function that validates model's properties with body's properties recieved
 * @param {*} modelProperties User/Post/Comment properties
 * @param {*} bodyProperties Body recieved
 */
const validateModel = (modelProperties, bodyProperties) => {
    let invalidProperties = [];
    bodyProperties.forEach(property => {
        let isValid = modelProperties.find(prop => prop === property);
        if(!isValid) { invalidProperties.push(property) }
    })

    if(invalidProperties.length > 0){
        throw new ValidatorError(665, 'Error trying to validate model properties', 400, invalidProperties);
    }
}

/**
 * @Description Get the model we are working for by looking inside request's original url (api/{model}).
 * @description If there's a invalid model inside api url this function will throw an error.
 * @returns Model name
 */
const getModel = (url) => {
    const urlSegments = url.split('/');
    const actualModel = urlSegments[2]; // Always 2 position in url /api/{model} <-
    const isValidModel = validModels.find(mdl => mdl === actualModel);
    if(!isValidModel) { throw new Error('An unexpected error was caugth trying to validate API url model')};

    return actualModel
}

module.exports = validator;