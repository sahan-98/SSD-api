const express = require('express');
const router = express.Router();

const { saveUser } = require('../controllers/user_controller');


// router.post('/auth', [], authenticate);
router.post('/signup', [], saveUser);


module.exports = router;