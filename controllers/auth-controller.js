const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { User } = require('../models/user-models');
const { genToken } = require('../utils/generate-token');
const HttpError = require('../utils/HttpError');

const saltRounds = 10;
const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

//? === Register User ===

const registerStudent = async (req, res, next) => {
  let existingUser;
  let token;
  let avatar;

  const {
    name,
    email,
    password,
    section,
    session,
    program,
    rollNo,
    gender,
    phoneNo,
  } = req.body;

  const avatarHash = crypto
    .createHash('md5')
    .update(email.toLowerCase())
    .digest('hex');

  if (gender)
    avatar = `https://avatars.dicebear.com/api/${gender}/:${avatarHash}.svg`;
  else avatar = `https://avatars.dicebear.com/api/bottts/:${avatarHash}.svg`;

  if (!emailRegexp.test(email)) {
    const error = new HttpError('Invalid Email Address', 404, 'email');
    console.error(error);
    return next(error);
  }

  if (password.length < 6) {
    const error = new HttpError(
      'Password should be more than 6 Characters',
      404,
      'password'
    );
    console.error(error);
    return next(error);
  }

  // ! Checking If User with same email already exists
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Something went wrong', 500, 'email');
    console.error(error);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('Email already in use', 403, 'email');
    console.error(error);
    return next(error);
  }
  //!-------------------------------------------------------

  // !Creating New User and generating a token with JWT
  bcrypt.hash(password, saltRounds, async (e, hash) => {
    if (e) {
      console.error('Bcrypt: While hashing', e);
      const error = new HttpError('Something went wrong', 500, 'password');
      return next(error);
    }
    const user = User({
      name,
      email,
      password: hash,
      avatar,
      section,
      session,
      program,
      rollNo,
      phoneNo,
      role: 'Student',
    });

    try {
      await user.save();

      token = genToken(user, next);

      const {
        name,
        email,
        avatar,
        section,
        session,
        program,
        rollNo,
        phoneNo,
        role,
      } = user;

      res.send({
        status: 202,
        message: 'Successfully Registered',
        'user-info': {
          name,
          email,
          avatar,
          section,
          session,
          program,
          rollNo,
          phoneNo,
          role,
        },
        token: token,
      });
    } catch (err) {
      console.error('While Saving User', err);
      const error = new HttpError(
        "Couldn't Register, please try again",
        500,
        'password'
      );
      return next(error);
    }
  });
  // !-------------------------------------------
};

//-------------------------------------------------------

//? === Login User ===

const login = async (req, res, next) => {
  let token;
  const { email, password } = req.body;
  try {
    await User.findOne({ email: email }, (err, foundUser) => {
      if (!err) {
        if (foundUser) {
          bcrypt.compare(password, foundUser.password, async (e, result) => {
            if (result) {
              token = await genToken(foundUser);
              res.send({
                status: 202,
                message: 'Login Successful',
                'user-info': {
                  _id: foundUser._id,
                  name: foundUser.name,
                  email: foundUser.email,
                  avatar: foundUser.avatar,
                },
                token,
              });
            } else {
              console.error(e);
              return res.send({
                message: "Passwords Don't Match",
                status: 404,
              });
            }
          });
        } else {
          console.error(err);
          return res.send({
            message: 'Invalid Email',
            status: 404,
          });
        }
      } else {
        console.error(err);
        return res.send({
          message: 'Something went wrong',
          status: 500,
        });
      }
    });
  } catch (err) {
    console.error(err);
    return res.send({
      message: 'Something went wrong',
      status: 500,
    });
  }
};

// ---------------------------------------------------

module.exports = {
  login,
  registerStudent,
};
