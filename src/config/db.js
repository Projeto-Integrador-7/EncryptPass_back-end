const mongoose = require('mongoose')
require('dotenv/config');

const env = process.env;

mongoose.connect(`mongodb+srv://${env.MONGODB_USER}:${env.MONGODB_PASSWORD}@cluster0.s2mjo.mongodb.net/encryptPass?retryWrites=true&w=majority`)

module.exports = mongoose;