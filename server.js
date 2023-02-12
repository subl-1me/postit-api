require('dotenv').config();
const app = require('./app');
const swagger = require('./src/routes/swagger');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listening on: ${PORT}`);

    swagger(app, PORT);
})

