const UserService = require('../services/user.service');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('../helpers/jwt');

class AuthService{

    async login(body){
        let sql = "SELECT * FROM users WHERE username = " + mysql.escape(body.value) + " OR email = " + mysql.escape(body.value);   
        let serviceResult = await UserService.createSqlQuery(sql, null);
        if(serviceResult.length === 0){
            return {
                status: 404,
                message: 'Invalid user or password.',
            }
        }

        const user = Object.values(JSON.parse(JSON.stringify(serviceResult)));
        console.log(user);
        // compare passwords
        const result = await bcrypt.compare(body.password, user.password);
        if(!result){
            return{
                status: 402,
                message: 'Invalid password.'
            }
        }

        const token = jwt.createToken(user);
        return {
            status: 200,
            message: 'Login successfully',        
            token: token
        }
    }

    async register(){

    }


}


module.exports = AuthService;