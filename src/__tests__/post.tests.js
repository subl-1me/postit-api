const supertest = require('supertest');
const app = require('../../app');
const db = require('../config/dbConnection');
const { v4: uuidv4 } = require('uuid');


// mock data to test
const mock_user = {
    _id: uuidv4(),
    username: 'mock_usr1',
    email: 'mock_usr@gmail.com',
    password: '12345'
}

describe('post routes tests', () => {
    beforeAll((done) => {
        db.connect((err) => {
            if(err){
                console.log('Something went wrong trying to conenct to database.');
            }

            db.query('TRUNCATE TABLE POSTS');

            // let sql = "INSERT INTO users SET ?";
            // db.query(sql, mock_user, (err, result) => {
            //     if(err){
            //         console.log(err);
            //     }
    
            //     console.log(result);
            //     done();
            // })

             supertest(app)
            .post('/api/user')
            .send(mock_user)
            .then((response) => {
                console.log(response.body);
                done();
            })
        })
    })

    it('POST api/post - Creates a new post', async (done) => {
        // after all, log in and get a token to be able to create a post
        return supertest(app)
        .post('/api/user/login')
        .send(mock_user)
        .then((response) => {
            const { token } = response.body;
            expect(token).toBeDefined();
        })
    })
})