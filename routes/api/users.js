const express = require('express');
const router = express.Router();
const {
  validateAuth,
  validateUpdateSub,
} = require('../../services/validation');
const userController = require('../../controllers/usersController');
const guard = require('../../services/guard');

router.post('/auth/register', validateAuth, userController.register);
router.post('/auth/login', validateAuth, userController.login);
router.post('/auth/logout', guard, userController.logout);
router.get('/current', guard, userController.currentUser);
router.patch('/', guard, validateUpdateSub, userController.updateSub);

module.exports = router;
