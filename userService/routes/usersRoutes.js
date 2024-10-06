const express = require('express');
const router = express.Router();

const { postLogin, postSignup } = require('../controllers/usersController');

// logging in
router.route('/login').post(postLogin)

// signing up
router.route('/signup').post(postSignup)


module.exports = router;