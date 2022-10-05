require('dotenv').config();
const jwt = require('jsonwebtoken');

const genToken = (user, next) => {
  let token;
  try {
    const tokenUser = {
      id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
    };
    token = jwt.sign({ tokenUser }, process.env.JWT_KEY, {
      expiresIn: '5h',
    });
    return token;
  } catch (err) {
    return next({ message: "Couldn't generate token", status: 500 });
  }
};

module.exports = { genToken };
