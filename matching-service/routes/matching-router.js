const express = require('express');
const router = express.Router();
const { requestMatch, consumeMatch } = require("../controllers/matching-controller")

router.route('/').post(requestMatch)

module.exports = router;