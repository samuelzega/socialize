const router = require('express').Router()
const UserController = require('../controllers/UserController')
const FeedController = require('../controllers/FeedController')

router.get('/', UserController.loginPage)
router.post('/', UserController.login)
router.get('/register', UserController.registerPage)
router.post('/register', UserController.register)
router.get('/page', UserController.userPage)
router.post('/page', FeedController.addFeed)
router.get('/edit/', UserController.editPage)
router.post('/edit/', UserController.edit)

module.exports = router