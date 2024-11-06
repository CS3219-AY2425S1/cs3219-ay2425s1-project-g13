const express = require('express');
const router = express.Router();

const { executePython } = require('../controllers/sandboxController')

// Execute python code
router.route('/execute').post(executePython)

module.exports = router;