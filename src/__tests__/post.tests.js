const supertest = require('supertest');
const app = require('../../app');
const db = require('../config/dbConnection');

// mock data to test
let mock_user = {
    _id: '',
    username: 'mock_usr1',
    email: 'mock_usr@gmail.com',
    password: '12345'
}

let mock_post = {
    content: 'This a content test :)))',
}

let mock_post2 = {
    content: 'This a content update.',
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

    it('GET api/post - Get a post by ownerId', async() => {
        return supertest(app)
        .post('/api/post/' + mock_user._id)
        .send(mock_post)
        .set('Authorization', token)
        .then(async (response) => {
            const { status, post } = response.body;
            expect(status).toBe(200);
            expect(post).toBeDefined();

            return supertest(app)
            .get('/api/post')
            .send({ownerId: mock_user._id}) // it may be ownerId or postId (_id)
            .then(async (response) => {
                console.log(response.body);
                const { status, post, message } = response.body;
                expect(status).toBe(200);
                expect(message).toBe('OK');
                expect(post).toBeDefined();
            })
        })
    })

    it('PUT api/post/:postId - Update post by ID', async() => {
        return supertest(app) // create new mock post   
        .post('/api/post/' + mock_user._id)
        .send(mock_post)
        .set('Authorization', token)
        .then(async (response) => {
            const { status, post } = response.body;
            expect(status).toBe(200);
            expect(post).toBeDefined();

            return supertest(app)
            .put('/api/post/' + post._id)
            .send({ ownerId: mock_user._id, changes: { content: mock_post2.content }})
            .set('Authorization', token)
            .then(async(response) => {
                const { status, message } = response.body;
                expect(status).toBe(200);
                expect(message).toBe('Post updated successfully');
            })
        })
    })

    it('DELETE api/post/:postId - Delete post by ID', async() => {
        return supertest(app) // create new mock post   
        .post('/api/post/' + mock_user._id)
        .send(mock_post)
        .set('Authorization', token)
        .then(async (response) => {
            const { status, post } = response.body;
            expect(status).toBe(200);
            expect(post).toBeDefined();

            return supertest(app)
            .delete('/api/post/' + post._id)
            .send({ownerId: post.ownerId})
            .set('Authorization', token)
            .then(async(response) => {
                const { status, message } = response.body;
                expect(status).toBe(200);
                expect(message).toBe('Post deleted successfully');
            })
        })
    })

})
