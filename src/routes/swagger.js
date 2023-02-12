const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// metadata info about our api
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            tile: 'post-it',
            version: "1.0.0",
            description: "Post what you think"
        },
    },
    apis: [
        "routes/post.routes.js",
        "routes/user.routes.js"
    ]
}

// Docs on JSON format
const swaggerSpec = swaggerJSDoc(options);

// functions to setup our docs
const swaggerDocs = (app, port) => {
    app.use('/api/docs/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('api/docs.json', (_, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log(`Api docs available on: http:localhost:${port}/api/docs`)
}

module.exports = swaggerDocs;
