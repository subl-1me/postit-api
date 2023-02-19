const supertest = require('supertest');
const app = require('../../app');
const db = require('../config/dbConnection');
const bcrypt = require('bcrypt');

describe('User routes tests', () => {

    beforeAll((done) => {
        db.connect((err) => {
            if(err){
                console.log('Error trying to connect to database');
                console.log(err);
            }

            db.query('TRUNCATE TABLE USERS');
            done(); 
        });
    })

    it('POST api/user -> create user', async() => {
        const mockUser = {
            username: 'carmensalinas',
            email: 'carmensalinas@gmail.com',
            password: '12345'
        }

        supertest(app)
        .post('/api/user')
        .send(mockUser)
        .then((response) => {
            const { status, message } = response.body;
            expect(status).toBe(200);
            expect(message).toBe('OK');
        })
    })

    it('GET api/user -> get all users', async() => {
        const mockUser = {
            username: 'dinamita',
            email: 'dinamita@gmail.com',
            password: 'dinamita'
        }

        return supertest(app)
        .post('/api/user')
        .send(mockUser)
        .then((response) => {
            expect(response.body.status).toBe(200);
            supertest(app)
            .get('/api/user')
            .then((response) => {
                const { status, users } = response.body;
                expect(status).toBe(200);
                expect(users).toBeDefined();
                return;
            })

        })
    })

    it('GET api/user/item/:userId -> get user by id', async() => {
        const userId = 1;
        return supertest(app)
        .get('/api/user/item/' + userId)
        .then((response) => {
            const { status, user } = response.body;
            expect(status).toBe(200);
            expect(user).toBeDefined();
            expect(user).toHaveProperty('username');
            expect(user).toHaveProperty('password');
            expect(user.id).toBe(1);
        })
    })

    it('PUT api/user/:userId -> update user', async() => {
        const data = {
            username: 'change',
            email: 'change@change.com',
            password: 'change'
        }
        const userId = 1;

        return supertest(app)
        .put('/api/user/' + userId)
        .send(data)
        .then((response) => {
            const { status, message } = response.body;
            console.log(response.body);
            expect(status).toBe(200);
            expect(message).toBe('OK');
        })
    })

    afterAll((done) => {
        db.destroy();
        done();
    })



    // it('POST api/user -> create user', async () => {
    //     const user = {
    //         username: 'bizarrp',
    //         email: 'mariquete@gmail.com',
    //         password: 12345
    //     }

    //     return supertest(app)
    //     .post('/api/user')
    //     .send(user)
    //     .then((response) => {
    //         console.log(response.body);
    //         const status = response.body.status;
    //         const message = response.body.message;
    //         expect(status).toEqual(200);
    //         expect(message).toEqual('OK');
    //     })  
    // })  

    // it('GET /user -> get all users', async() => {
    //     return supertest(app)
    //     .get('/api/user')
    //     .expect('Content-Type', /json/)
    //     .then((response) => {
    //         const status = response.body.status;
    //         expect(status).toEqual(200);
    //     })
    // })

    // it('GET /user/:id -> Get user by ID', async() => {

    // })

    // it('PUT /user -> update user by ID', async() => {

    //     return supertest(app)
    //     .put('/api/user')
    //     .then((response) => {
    //         const { status, message, updatedUser } = response.body;
    //         expect(status).toBe(200);
    //         expect(message).toBe('OK');
    //         expect(updatedUser).to
    //     })
    // })

})

