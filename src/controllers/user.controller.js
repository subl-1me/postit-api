const userService = require('../services/user.service');
const userValidator = require('../validators/user.validators');
const jwt = require('../helpers/jwt');

const addUser = async(req, res) => {
    const user  = req.body;

    // Validate duplicated username or email case
    const validatingErrors = await userValidator(user);
    if(validatingErrors.length > 0){
        return res.send({
            status: 200,
            errors: validatingErrors
        })
    }

    // If validate is OK
    const serviceResponse = await userService.insert(user);
    return res.send(serviceResponse);
}

const getUsers = async(_, res) => {
    const serviceResponse = await userService.items();
    return res.send(serviceResponse);
}

const getUserById = async(req, res) => {
    const { userId } = req.params;
    if(!userId) {
        return res.send({
            status: 200,
            error: 'User ID is required'
        })
    } 

    const serviceResponse = await userService.itemById(userId);
    return res.send(serviceResponse);

}

const updateUser = async(req, res) => {
    const { userId } = req.params;
    const data = req.body;
    if(!userId){
        return res.send({
            status: 200,
            error: 'User ID is required'
        })
    }

    const serviceResponse = await userService.updateItemById(userId, data);
    return res.send(serviceResponse);
}

const login = async(req, res) => {
    const user = req.body;
    const checkerResponse = await userService.userAuthChecker(user);
    if(!checkerResponse.isDataValid){
        return res.send({
            status: 200,
            isDataValid: checkerResponse.valid,
            errors: checkerResponse.errors
        })
    }

    const token = jwt.createToken(checkerResponse.user);
    return res.send({
        status: 200,
        message: 'User authenticated successfully',
        token: token
    })
}

const deleteUser = async(req, res) => {
    const { userId } = req.params;
    if(!userId) {
        return res.send({
            status: 200,
            error: 'User ID is required.'
        })
    }

    const serviceResponse = await userService.deleteItem(userId);
    return res.send(serviceResponse);
}


module.exports = {
    addUser,
    getUsers,
    getUserById,
    updateUser,
    login,
    deleteUser
}