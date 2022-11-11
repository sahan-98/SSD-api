const Message = require('../schemas/message_schema');
const config = require('../config.json');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');


  const gelAllMessages = async () => {
    return Message.find({})
  }

  
  exports.gelAllMessages = gelAllMessages;
