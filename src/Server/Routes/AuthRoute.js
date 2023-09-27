const { Signup, Login } = require('../Controllers/AuthController');
const { userVerification, UpdateUserChat } = require('../Middlewares/AuthMiddleware');
const router = require('express').Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/update', UpdateUserChat)
router.post('/', userVerification)

module.exports = router;