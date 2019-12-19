'use strict'

const express = require('express')
const router = express.Router()
const FeedController = require('../controllers/FeedController');
const multer  = require('multer')
const upload = multer({ dest: 'public/images/' })
const checkLogin = require('../middlewares/checkLogin')
// define the home page route
router.get('/', checkLogin, FeedController.showFeed);
router.get('/add', FeedController.showAddFeedForm);
router.post('/add', FeedController.addFeed);
router.get('/edit/:id', FeedController.showEditFeedForm);
router.get('/tagged/:tagName', FeedController.showFeedTagged);
router.get('/like/:feedId', FeedController.like)
router.get('/dislike/:feedId', FeedController.dislike)


module.exports = router