const express = require('express');
const router = express.Router();
const authorize = require('../_helpers/authorize');
const Role = require('../_helpers/role');

const { saveUser, authenticate, getUserById } = require('../controllers/user_controller');



router.post('/auth', [], authenticate);
router.post('/signup', [], saveUser);
router.get('/:id', authorize(), getUserById);


module.exports = router;