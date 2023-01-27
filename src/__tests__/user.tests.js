const supertest = require('supertest');
const app = require('../../app');

describe('User routes tests', () => {

    it('POST /user -> created user', async() => {
        const user = {
            id: 1,
            username: 'test1',
            password: '12345',
            email: 'test1@hotmail.com'
        }

        return supertest(app)
        .post('/api/user')
        .send({user})
        .then((response) => {
            expect(response.body).not.toHaveProperty('error');
            expect(response.body).toHaveProperty('userRecieved');
            expect(response.body).toHaveProperty('status', 200);
            expect(response.body).toHaveProperty('message');
        })
    })

    it('GET /user -> get all items', () => {
        return supertest(app)
        .get('/api/user')
        .expect('Content-Type', /json/)
        .then((response) => {
            expect(response.body).toHaveProperty('users');
        })
    })

})

