const router = require('express').Router()
const UserController = require('../controllers/UserController')
const FeedController = require('../controllers/FeedController')

router.get('/', UserController.loginPage)
router.post('/', UserController.login)
router.get('/register', UserController.registerPage)
router.post('/register', UserController.register)
router.get('/:id', UserController.userPage)
router.post('/:id', FeedController.addFeed)
router.get('/edit/:id', UserController.editPage)
router.post('/edit/:id', UserController.edit)

module.exports = router