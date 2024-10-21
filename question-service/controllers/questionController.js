const Question = require('../models/questionModel')

// returns every question in the database 
exports.getQuestions = async (req, res, next) => {
    try {
        let questions = await Question.find({})
        res.status(200).json(questions)

    } catch (err) {
        console.log(err)
    }
}

// returns a question with the specified id
exports.getQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id)
        res.status(200).json(question)
    } catch(error) {
        res.status(400).json({ message: 'Cannot find quesiton.' })
    }

}

// adds new question
exports.addQuestion = async (req, res, next) => {
    const { title, description, category, complexity } = req.body
    if (!title || !description || !category || !complexity) {
        return res.status(400).json({ message: 'Please enter all fields.'})
    }

    try {
        const newQuestion = await Question.create({
            title, 
            description, 
            category, 
            complexity
        })

        res.status(201).json({
            _id: newQuestion._id,
            title: newQuestion.title,
            description: newQuestion.description,
            category: newQuestion.category,
            complexity: newQuestion.complexity
        })
    } catch(error) {
        return res.status(400).json({ message: 'Invalid question data.' })
    }
}

// updates a question with the specified id
exports.updateQuestion = async (req, res, next) => {
    const { title, description, category, complexity } = req.body
    try {
        const question = await Question.findById(req.params.id)
        question.title = title
        question.description = description
        question.category = category
        question.complexity = complexity
        await question.save()

        res.status(200).json(question)
    } catch(error) {
        return res.status(400).json({ message: 'Invalid question data.' })
    }
}

// deletes a question with the specified id
exports.deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.deleteOne({ _id: req.params.id })
        res.status(200).json({ message: 'Question removed' })
    } catch(error) {
        return res.status(400).json({ message: 'Question not found' })
    }
}