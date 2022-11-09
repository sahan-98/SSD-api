const User = require('../schemas/user_schema');
const config = require('../config.json');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');


const authenticate = async ({ username,password }) => {
    const user = await User.findOne({ username });
    const match = await bcrypt.compare(password, user.password);
    if (match){
      console.log("sdad",user);
      const token = jwt.sign({ sub: user.userid, role: user.role }, config.secret);
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        token
      };
    } 
  }
  
  // const getAllUsers = async () => {
  //   return User.map(u => {
  //       const { password, ...userWithoutPassword } = u;
  //       return userWithoutPassword;
  //   })
  // }

  const getUserById = async (userid) => {
    const userObj = await User.findOne({ userid });
    if (!userObj) return;
    const user = userObj._doc;
    const { password, ...userWithoutPassword } = user;
    console.log("sdsdasdscasc",userWithoutPassword);
    return userWithoutPassword;
  }

  
  exports.getUserById = getUserById;
  exports.authenticate = authenticate;
  // exports.getAllUsers = getAllUsers;