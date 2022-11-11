const express = require('express');
const router = express.Router();
const authorize = require('../_helpers/authorize');
const Role = require('../_helpers/role');

const {saveMessage,gelAllMessages} = require('../controllers/message_controller');




router.post('/', [], saveMessage);
router.get('/', [], gelAllMessages);


module.exports = router;