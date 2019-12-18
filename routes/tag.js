'use strict'

const express = require('express')
const router = express.Router()
const TagController = require('../controllers/TagController');

// define the home page route
router.get('/', TagController.showAllTags);

module.exports = router