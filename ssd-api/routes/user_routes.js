const express = require('express');
const router = express.Router();
const authorize = require('../_helpers/authorize');
const Role = require('../_helpers/role');

const { saveUser, authenticate, getAllUsers, getUserById } = require('../controllers/user_controller');



router.post('/auth', [], authenticate);
router.post('/signup', [], saveUser);
// router.get('/', authorize(Role.Admin), getAllUsers);
router.get('/:id', authorize(), getUserById);


module.exports = router;