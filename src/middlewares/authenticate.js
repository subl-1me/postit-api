const { verifyToken } = require('../helpers/jwt');
const moment = require('moment');
const AuthenticationError = require('../errors/AuthenticationError');

const authenticate = async(req, res, next) => {
    try{
        const token = req.headers.authorization;
        if(!token) { 
            throw new AuthenticationError(401, 'User is not authenticated', 401) 
        }

        const decodedToken = verifyToken(token);
        let now = moment().unix();
        if(now > decodedToken.exo){ // is token expired?
            throw new AuthenticationError(402, 'Expired token', 401);
        }

        //TODO: Create delete req auth verification
        // make sure the owner is trying to update or delete an item
        const { baseUrl } = req;
        if(req.route.methods.put || req.route.methods.delete){ 
            if(baseUrl === '/api/user'){
                const { userId } = req.params;
                if(userId !== decodedToken._id){
                    throw new AuthenticationError(403, 'Not authorized', 401)
                }
            }

            if(baseUrl === '/api/post'){
                const { ownerId } = req.body;
                if(ownerId !== decodedToken._id){
                    throw new AuthenticationError(404, 'Not authorized', 401)
                }
            }  
        }

        next();
    }catch(err){
        next(err)
    }
}



module.exports = authenticate;