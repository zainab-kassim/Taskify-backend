const jwt = require('jsonwebtoken');
const { secretKey } = require('./config'); // Import the secret key


function generateToken(user) {
  const payload = {
    id: user._id,
    username: user.Username,
    // Add other user information as needed
  };


  const options = {
    expiresIn: '10s', // Set token expiration time
  };


  return jwt.sign(payload, secretKey, options);
}

module.exports=generateToken;

