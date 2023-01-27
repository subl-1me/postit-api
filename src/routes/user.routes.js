const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {    
    const { user } = req.body;

    res.send({
        status: 200,
        message: 'User created',
        userRecieved: user
    })
})

router.get('/', (_, res) => {
    const users = {
        1: {
          id: 1,
          username: 'test1',
          password: '12345',
          email: 'test1@gmail.com'  
        },
        2: {
            id: 2,
            username: 'test2',
            password: '12345',
            email: 'test2@gmail.com'  
        },
        3: {
            id: 3,
            username: 'test3',
            password: '12345',
            email: 'test3@gmail.com'  
        }  
    }

    res.send({
        users: users
    });
})

module.exports = router;