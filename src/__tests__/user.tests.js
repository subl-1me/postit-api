require('dotenv').config();
const supertest = require('supertest');
const app = require('../../app');
const db = require('../config/dbConnection');
const jwt = require('jwt-simple');
const JWT_KEY = process.env.JWT_KEY;

describe('User routes tests', () => {

    beforeAll((done) => {
        db.connect((err) => {
            if(err){
                console.log('Error trying to connect to database');
                console.log(err);
            }

            // Before start, clear users' table
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

        return supertest(app)
        .post('/api/user')
        .send(mockUser)
        .then((response) => {
            const { status, message } = response.body;
            expect(status).toBe(200);
            expect(message).toBe('OK');
        })
    })

    it('GET api/user -> get all users', async() => {

        return supertest(app)
        .get('/api/user')
        .then((response) => {
            const { status, users } = response.body;
            expect(status).toBe(200);
            expect(users).toBeDefined();
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
            expect(user.username).toBe('carmensalinas');
            expect(user.email).toBe('carmensalinas@gmail.com');
            expect(user.id).toBe(1);
        })
    })

    it('PUT api/user/:userId -> update user', async() => {
        // login first to get token and be able to update user
        let mockUserData = {
            username: 'carmensalinas',
            password: '12345'
        }

        return supertest(app)
        .post('/api/user/login')
        .send(mockUserData)
        .then(async(response) => {
            const { status, message, token } = response.body;
            expect(status).toBe(200);
            expect(message).toBe('User authenticated successfully');
            expect(token).toBeDefined();

            // fields to change
            let data = { username: 'vargas' }
            const userId = 1;
            return supertest(app)
            .put('/api/user/' + userId)
            .send(data)
            .set('Authorization', token)
            .then((response) => {
                const { status, message } = response.body;
                expect(status).toBe(200);
                expect(message).toBe('User updated successfully.');
            })
        });


    })

    it('PUT api/user/:userId -> Error trying to update an invalid user property', async() => {
        let mockUserData = {
            username: 'vargas',
            password: '12345'
        }

        // Login first
        return supertest(app)
        .post('/api/user/login')
        .send(mockUserData)
        .then(async(response) => {
            const { status, message, token } = response.body;

            expect(status).toBe(200);
            expect(message).toBe('User authenticated successfully');
            expect(token).toBeDefined();

            const mock_data = {
                username: 'some-change',
                warnings_count: 50, // invalid property
                friends: 100, // invalid property
                email: 'changes@arecool.com'
            }
            return supertest(app)
            .put('/api/user/' + '1')
            .send(mock_data)
            .set('Authorization', token)
            .then((response) => {
                const { status, errorCode, message } = response.body;
                expect(status).toBe(200);
                expect(errorCode).toBe(300);
                expect(message).toBe('Unexpected invalid properties.');
            })
        })
    })

    it('DELETE api/user/:userId - Destroy account', async() => {
        let auth_data = {
            username: 'vargas',
            password: '12345',
        }

        return supertest(app)
        .post('/api/user/login')
        .send(auth_data)
        .then(async(response) => {
            const { token } = response.body;
            expect(token).toBeDefined();

            return supertest(app)
            .delete('/api/user/' + 1)
            .set('Authorization', token)
            .then((response) => {
                const { status, message } = response.body;
                expect(status).toBe(200);
                expect(message).toBe('User deleted successfully');
            })
        });
    })

    afterAll((done) => {
        db.destroy();
        done();
    })
})

