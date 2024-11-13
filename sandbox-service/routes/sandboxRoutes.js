const express = require('express');
const router = express.Router();

const { executePython, executeJavascript } = require('../controllers/sandboxController')

// Execute python code
router.route('/execute-py').post(executePython)
router.route('/execute-js').post(executeJavascript)

module.exports = router;