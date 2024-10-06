const mongoose = require('mongoose')
const dotenv = require('dotenv').config();

const connectDB = async() => {
    try {
        const con = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${con.connection.host}`)
    } catch(error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB; 