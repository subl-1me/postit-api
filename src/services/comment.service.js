const db = require('../config/dbConnection');

class CommentService {
    async insert(data){
        return {
            status: 200,
            message: 'OK'
        }
    }

    async items(){
        return {
            status: 200,
            items: []
        }
    }

    async itemById(id){
        return {
            status: 200,
            item: []
        }
    }

    async remove(id){
        return {
            status: 200,
            message: 'OK'
        }
    }

    async update(id){   
        return {
            status: 200,
            message: 'OK'
        }
    }
}

module.exports = CommentService;