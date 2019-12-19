'use strict'

const express = require('express')
const router = express.Router()
const TagController = require('../controllers/TagController');
const checkLogin = require('../middlewares/checkLogin')

// define the home page route
router.get('/', checkLogin, TagController.showAllTags);

module.exports = router