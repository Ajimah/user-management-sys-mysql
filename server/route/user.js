const express = require('express');
const router = express.Router();

// Correctly require the userController module (update the path based on your project structure)
const userController = require('../controllers/userController.js');

// Define routes
router.get('/', userController.view);
router.post('/', userController.find);
router.get('/adduser', userController.form);
router.post('/adduser', userController.create);
router.get('/edituser/:user_id', userController.edit);
router.post('/edituser/:user_id', userController.update);
router.get('/viewuser/:user_id', userController.viewall);
router.get('/:user_id', userController.delete);

module.exports = router;
