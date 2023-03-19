require('dotenv').config();
const supertest = require('supertest');
const app = require('../../app');
const db = require('../config/dbConnection');

describe('User routes tests', () => {

    beforeAll((done) => {
        db.query('SET FOREIGN_KEY_CHECKS = 0');
        done();
    })

    it('POST api/user -> create user', async() => {
        const mockUser = {
            username: 'carmensalinas',
            email: 'carmensalinas@gmail.com',
            password: 12345
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
            const { status, message, token, user_id} = response.body;
            expect(status).toBe(200);
            expect(message).toBe('User authenticated successfully');
            expect(token).toBeDefined();

            // fields to change
            let data = { username: 'vargas' }
            return supertest(app)
            .put('/api/user/' + user_id)
            .send(data)
            .set('Authorization', token)
            .then((response) => {
                const { status, message } = response.body;
                expect(status).toBe(200);
                expect(message).toBe('User updated successfully.');
            })
        });
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
            const { token, user_id } = response.body;
            expect(token).toBeDefined();

            return supertest(app)
            .delete('/api/user/' + user_id)
            .set('Authorization', token)
            .then((response) => {
                const { status, message } = response.body;
                expect(status).toBe(200);
                expect(message).toBe('User deleted successfully');
            })
        });
    })


})

