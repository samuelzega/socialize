'use strict'

const express = require('express')
const router = express.Router()
const FeedController = require('../controllers/FeedController');

// define the home page route
router.get('/', FeedController.showFeed);
router.get('/add', FeedController.showAddFeedForm);
router.post('/add', FeedController.addFeed);
router.get('/edit/:id', FeedController.showEditFeedForm);
module.exports = router