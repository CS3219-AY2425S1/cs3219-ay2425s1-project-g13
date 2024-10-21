const mongoose = require('mongoose')
const dotenv = require('dotenv').config();

const connectDB = async() => {
    try {
        const con = await mongoose.connect(process.env.DB_CLOUD_URI_QUESTION)
        console.log(`MongoDB connected: ${con.connection.host}`)
    } catch(error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB; 