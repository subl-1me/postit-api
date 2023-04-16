const userService = require('../services/user.service');
const jwt = require('../helpers/jwt');
const bcrypt = require('bcrypt');
const db = require('../config/dbConnection');
const mysql = require('mysql');


const addUser = async(req, res) => {
    const user  = req.body;

    const serviceResponse = await userService.insert(user);
    return res.send(serviceResponse);
}

const getUsers = async(_, res) => {
    const serviceResponse = await userService.items();
    return res.send(serviceResponse);
}

const getUserBy = async(req, res) => {
    const { filter } = req.params;
    const { body } = req.body;

    //TODO: Make get user query
    const serviceResponse = await userService.getUserBy(filter, body);
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
    getUserBy,
    updateUser,
    deleteUser
}