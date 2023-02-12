// router automatically will use one by one router files

const express = require('express');
const fs = require('fs');
const router = express.Router();

const PATH_ROUTES = __dirname;

const removeExtension = (fileName) => {
    return fileName.split('.').shift();
}

// read dir
fs.readdirSync(PATH_ROUTES).filter((file) => {
    const name = removeExtension(file);
    if(name !== 'index' && name !== 'swagger'){
        router.use(`/${name}`, require(`./${file}`));
    }
})

module.exports = router;