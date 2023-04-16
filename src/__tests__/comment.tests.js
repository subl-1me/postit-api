const supertest = require('supertest');
const app = require('../../app');
const db = require('../config/dbConnection');

const UserService = require('../services/user.service');
const PostService = require('../services/post.service');

describe('Comments routes', () => {

    let mock_user = {
        username: 'test',
        email: 'test@gmail.com',
        password: '12345'
    }
    
    let mock_post = {
        _id: '',
        content: 'This is a mock post',
    }
    
    let mock_comment = {
        _id: '',
        ownerId: '',
        postId: '',
        content: 'This is a test comment :)'
    }
    
    it('POST /api/comment - Insert a new comment', async() => {
        // Creates an mock user and post and save their ids
        const userRes = await UserService.insert(mock_user);
        const { userId } = userRes;
        // update global mock 
        mock_comment.ownerId = userId;

        expect(userRes.status).toBe(200);
        expect(userId).toBeDefined();

        const postRes = await PostService.insert(mock_post, userId);
        const postId = postRes.post._id;

        // update global mock 
        mock_post._id = postId;
        mock_comment.postId = postId;   
        expect(postRes.status).toBe(200);
        expect(postId).toBeDefined();



        // login first to get token
        //TODO: CHECK WHY THIS IS NOT WORKING
        return supertest(app)
        .post('/api/user/login')
        .send({username: mock_user.username, password: '12345'})
        .then(async(res) => {
            const { token } = res.body;
            expect(token).toBeDefined();

            // Create a comment into new post created
            return supertest(app)
            .post('/api/comment')
            .send(mock_comment)
            .set('Authorization', token)
            .then((res) => {
                const { success, body, commentId } = res.body;
                mock_comment._id = commentId;
                expect(success).toBe(true);
                expect(body).toBeDefined();
                expect(commentId).toBeDefined();
            })
        })
    })

    it('GET /api/comment - Get comments ', async() => {
        return supertest(app)
        .get('/api/comment')
        .then((res) => {
            const { success, comments } = res.body;
            expect(success).toBe(true);
            expect(comments).toBeDefined();
        })
    })

    it('GET /api/comment/:commentId - Get a comment by ID', async() => {
        return supertest(app)
        .get('/api/comment/' + mock_post._id)
        .then((res) => {
            const { success, comment } = res.body;
            expect(success).toBe(true);
            expect(comment).toBeDefined();
        })
    })

    it('PUT /api/comment/:commentId - Update a commet by its ID', async() => {
        return supertest(app)
        .post('/api/user/login')
        .send({username: mock_user.username, password: '12345'})
        .then(async (res) => {
            const { token } = res.body;
            expect(token).toBeDefined();

            return supertest(app)
            .put('/api/comment/' + mock_comment._id)
            .send({ content: 'This is the new content dog' })
            .set('Authorization', token)
            .then((res) => {
                const { success, updatedComment, message } = res.body;
                expect(success).toBe(true);
                expect(updatedComment).toBeDefined();
                expect(message).toBe('Comment updated successfully')
            })
        })
    })

    it('PUT /api/comment/:commentId - Add like to a comment', async() => {
        return supertest(app)
        .post('/api/user/login')
        .send({username: mock_user.username, password: '12345'})
        .then(async(res) => {
            const { token } = res.body;
            expect(token).toBeDefined();

            return supertest(app)
            .put('/api/comment/' + mock_comment._id)
            .send({liked: true})
            .set('Authorization', token)
            .then((res) => {
                const { success, message, body } = res.body;
                expect(success).toBe(true);
                expect(message).toBe('Post liked successfully');
                expect(body).toBeDefined();
            })
        })
    })

    it('DELETE /api/comment/:commentId - Delete a comment', async() => {
        return supertest(app)
        .post('/api/user/login')
        .send({username: mock_user.username, password: '12345'})
        .then(async(res) => {
            const { token } = res.body;
            expect(token).toBeDefined();

            return supertest(app)
            .delete('/api/comment/' + mock_comment._id)
            .set('Authorization', token)
            .then((res) => {
                const { success, message } = res.body;
                expect(success).toBe(true);
                expect(message).toBe('Comment was deleted successfully');
            })
        })
    })


    afterAll(() => {
        db.query('TRUNCATE TABLE users');
        // db.query('TRUNCATE TABLE comments');
    })

})