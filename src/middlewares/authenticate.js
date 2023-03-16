const { verifyToken } = require('../helpers/jwt');
const moment = require('moment');
const UserError = require('../errors/UserError');

const authenticate = async(req, res, next) => {
    try{
        let token = req.headers.authorization;
        if(!token) { 
            throw new UserError(301, 'User is not authenticated', 401) 
        }

        const decodedToken = verifyToken(token);
        let now = moment().unix();
        if(now > decodedToken.exo){ // is token expired?
            throw new UserError(302, 'Expired token. Please log in again.', 400);
        }

        // make sure the owner is trying to update
        if(req.route.methods.put){ 
            // let { userId } = req.params;
            // if(userId !== decodedToken._id){
            //     throw new Error('Unauthorized')
            // }
            const { baseUrl } = req;
            if(baseUrl === '/api/post'){ // it means update post
                // we need to compare post ownerId to auth token id
                const { ownerId } = req.body;
                if(ownerId !== decodedToken._id){
                    throw new UserError(303, 'This user is not authorized to realize that action', 401)
                }
            }
            
        }

        next();
    }catch(err){
        next(err)
    }
}

module.exports = authenticate;