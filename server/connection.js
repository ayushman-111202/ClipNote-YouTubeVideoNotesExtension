const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URL;

mongoose.connect(url)
    .then(() => {
        console.log('Database Connected');
    })
    .catch((err) => {
        console.log(err);
    })

module.exports = mongoose;