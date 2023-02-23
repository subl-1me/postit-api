const express = require('express');
const cors = require('cors');
const app = express();

const errorHandler = require('./src/middlewares/errorHandler');
const authenticate = require('./src/middlewares/authenticate');

app.use(cors());
app.use(express.json());

app.use('/api', require('./src/routes'));

// Middlewares
app.use(errorHandler);
app.use(authenticate);

module.exports = app;
