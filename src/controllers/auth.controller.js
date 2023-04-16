const AuthService = require('../services/auth.service');
const AuthServiceInstance = new AuthService();

const login = async(req, res) => {
    const { body } = req;
    //TODO: Create a body validator

    const serviceRes = await AuthServiceInstance.login(body);
    return res.send(serviceRes);
}

const register = async(req, body) => {

}


module.exports = {
    login,
    register
}