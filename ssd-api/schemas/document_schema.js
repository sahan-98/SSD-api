const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userid: {type: String, required: [true, 'User ID is requied'] },
    username: {type: String, required: [true, 'User Name is requied'] },
    role: {type: String, required: [true, 'Role is requied'] },
    document: {type: String, required: [true, 'document is requied'] },


})

module.exports = mongoose.model('Documents', userSchema);