const express = require('express');
const router = express.Router();

const { getQuestion, getQuestions, addQuestion, updateQuestion, deleteQuestion } = require('../controllers/questionController');

// get a question with the specified id
router.route('/:id').get(getQuestion)

// get all questions
router.route('/').get(getQuestions)

// add new question
router.route('/').post(addQuestion)

// update a question with the specified id
router.route('/:id').put(updateQuestion)

// delete a question with the specified id
router.route('/:id').delete(deleteQuestion) 

module.exports = router;