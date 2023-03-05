const userService = require('../services/user.service');
const jwt = require('../helpers/jwt');
const bcrypt = require('bcrypt');


const addUser = async(req, res) => {
    const user  = req.body;

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

    const serviceResponse = await userService.getUserBy('_id', userId);
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

    const serviceResponse = await userService.updateItem(userId, data);
    return res.send(serviceResponse);
}

const login = async(req, res) => {
    const data = req.body;
    let serviceResponse;

    // make sure if user exists by looking for a valid email or username
    if(data.username){
        serviceResponse = await userService.getUserBy('username', data.username);
    }else{
        serviceResponse = await userService.getUserBy('email', data.email);
    }

    if(serviceResponse.user.length === 0){ 
        return res.send(serviceResponse)
    }

    let result = await bcrypt.compare(data.password, serviceResponse.user.password);
    if(!result){
        return res.send({ status: 200, message: 'Invalid password' })
    }

    const token = jwt.createToken(serviceResponse.user);
    return res.send({
        status: 200,
        message: 'User authenticated successfully',
        user_id: serviceResponse.user._id,
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