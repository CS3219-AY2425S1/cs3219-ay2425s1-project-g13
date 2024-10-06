const mongoose = require('mongoose')

// enum values for categories and complexities of a question.
// const CATEGORIES = ['Strings', 'Algorithms', 'Data Structures', 'Bit Manipulation', 'Recursion', 'Databases', 'Brainteaser', 'Arrays']
// const COMPLEXITIES = ['Easy', 'Medium', 'Hard']

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    complexity: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Question', questionSchema)