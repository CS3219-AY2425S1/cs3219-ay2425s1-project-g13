const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config();
const connectDB = require('./config/db')
const questionsRouter = require('./routes/questionsRoutes')

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

const PORT_QUESTION = process.env.PORT_QUESTION;

app.listen(PORT_QUESTION, () => {
    console.log(`Server is running on port ${PORT_QUESTION}`)
})

// GET /api/questions/:id to get question
// GET /api/questions/ to get all questions
// POST /api/questions to add new question
// PUT /api/questions/:id to update a question
// DELETE /api/questions/:id to update a question
app.use('/api/questions', questionsRouter);

module.exports = app