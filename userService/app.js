const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config();
const connectDB = require('./config/db')
const usersRouter = require('./routes/usersRoutes')

connectDB();

const app = express()

app.options(
    '*',
    cors({
        origin: 'http://localhost:3000', // Define port frontend is on for access
        optionsSuccessStatus: 200
    })
)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const PORT_USER = process.env.PORT_USER;

app.listen(PORT_USER, () => {
    console.log(`Server is running on port ${PORT_USER}`)
})

// POST /api/users/login to login
// POST /api/users/signup
app.use('/api/users', usersRouter);

module.exports = app