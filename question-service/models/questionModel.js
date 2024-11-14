const mongoose = require('mongoose');

// enum values for categories and complexities of a question.
const CATEGORIES = ['Strings', 'Algorithms', 'Data Structures', 'Bit Manipulation', 'Recursion', 'Databases', 'Brainteaser', 'Arrays'];
const COMPLEXITIES = ['Easy', 'Medium', 'Hard'];

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
        enum: COMPLEXITIES,
        required: true
    }
});

const Question = mongoose.model('Question', questionSchema);

const getRandomQuestion = async (payload) => {
    try {
        const { complexity, category } = payload;
        const [randomQuestion] = await Question.aggregate([
            // Match documents with the given category and complexity
            { $match: { category, complexity } },

            // Sample one random document from the matched results
            { $sample: { size: 1 } }
        ]);
        console.log("printing random question:", randomQuestion)
        return randomQuestion; // Will be undefined if no match is found
    } catch (error) {
        console.error("Error fetching random question:", error);
        throw error;
    }
};

module.exports = { Question, getRandomQuestion };
