require('dotenv').config();
const mongoose = require('mongoose');

const connectDb = () => {
    // Database connection
    const url = process.env.MONGO_CONNECTION_URL;
    mongoose.connect(url);
    const connection = mongoose.connection;
    try {
        connection.once('open', () => {
            console.log('Database Connected')
        })
    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDb;