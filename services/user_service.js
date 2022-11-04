const User = require('../schemas/user_schema');
const config = require('../config.json');
const jwt = require('jsonwebtoken')


const authenticate = async ({ username,password }) => {
    const user = User.find( u => u.username === username && u.password === password);
    if (user){
      const token = jwt.sign({ sub: user.userid, role: user.role }, config.secret);
      const { password, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        token
      };
    } 
  }
  
  const getAllUsers = async () => {
    return User.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    })
  }

  const getUserById = async (userid) => {
    const user = User.find(u => u.userid === parseInt (userid));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  exports.getUserById = getUserById;
  exports.authenticate = authenticate;
  exports.getAllUsers = getAllUsers;