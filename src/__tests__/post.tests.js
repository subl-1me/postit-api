const supertest = require('supertest');
const app = require('../../app');
const db = require('../config/dbConnection');

// mock data to test
const mock_user = {
    username: 'mock_usr1',
    email: 'mock_usr@gmail.com',
    password: '12345'
}

const mock_post = {
    content: 'Me gusta comer huevitos con un chingo de chorizo',
}

let token = '';

describe('post routes tests', () => {

    beforeAll(async() => {
        db.query('TRUNCATE TABLE POSTS');

        return supertest(app) // create mock user
        .post('/api/user')
        .send(mock_user)
        .then(async(response) => {
            const { userId } = response.body;
            expect(userId).toBeDefined();
            mock_user._id = userId;

            return supertest(app) // login to get token
            .post('/api/user/login')
            .send(mock_user)
            .then((response) => {
                let tempToken = response.body.token;
                expect(tempToken).toBeDefined();
                token = tempToken;
            })
        })
    })

    it('POST api/post - Creates a new post', async () => {
        return supertest(app)
        .post('/api/post/' + mock_user._id) // _id was defined after all tests
        .send(mock_post)
        .set('Authorization', token)
        .then((response) => {
            const { status, post } = response.body;
            expect(status).toBe(200);
            expect(post).toBeDefined();
        })
    })

    it('GET api/post - Get all posts', async() => {
        return supertest(app)
        .get('/api/post')
        .then((response) => {

            const { status, posts } = response.body;
            expect(status).toBe(200);
            expect(posts).toBeDefined();
        })
    })

    it('PUT api/post/:postId - Update post by ID', async() => {
        return supertest(app) // create new mock post   
        .post('/api/post' + mock_user._id)
        .send(mock_post)
        .set('Authorization', token)
        .then(async (response) => {
            const { status, post } = response.body;
            expect(status).toBe(200);
            expect(post).toBeDefined();

            return supertest(app)
            .put('/api/post/' + post._id)
            .set('Authorization', token)
            .then((response) => {
                const { status, newPost, olderPost } = response.body;
                console.log(response);
                expect(status).toBe(200);
            })
        })
    })

})