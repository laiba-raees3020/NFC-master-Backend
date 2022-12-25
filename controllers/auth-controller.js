const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { Student } = require('../models/user-models');
const HttpError = require('../utils/HttpError');

const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

//? === Register Student ===

const registerStudent = async (req, res, next) => {
  let existingStudent;
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

  if (password.length < 8) {
    const error = new HttpError(
      'Password should be more than 8 Characters',
      404,
      'password'
    );
    console.error(error);
    return next(error);
  }

  // ! Checking If Student with same email already exists
  try {
    existingStudent = await Student.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Something went wrong', 500, 'email');
    console.error(err);
    return next(error);
  }

  if (existingStudent) {
    const error = new HttpError('Email already in use', 403, 'email');
    console.error(error);
    return next(error);
  }
  //!-------------------------------------------------------

  // !Creating New Student
  const saltRounds = await bcrypt.genSalt(10);
  bcrypt.hash(password, saltRounds, async (e, hash) => {
    if (e) {
      console.error('Bcrypt: While hashing', e);
      const error = new HttpError('Something went wrong', 500, 'password');
      return next(error);
    }
    const user = Student({
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

      const {
        _id: id,
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

      req.session.isAuth = true;
      req.session.user = {
        id,
        name,
        email,
        avatar,
        section,
        session,
        program,
        rollNo,
        phoneNo,
        role,
      };

      res.send({
        status: 202,
        message: 'Successfully Registered',
        'user-info': {
          id,
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

//? === Is User Logged In ===
const checkAuth = async (req, res, next) => {
  if (req.session.user) res.send({ loggedIn: true, user: req.session.user });
  else res.send({ loggedIn: false });
};

//? === Login User ===

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const foundUser = await Student.findOne({ email: email });
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, async (e, result) => {
        if (result) {
          req.session.isAuth = true;
          req.session.user = {
            id: foundUser._id,
            name: foundUser.name,
            email: foundUser.email,
            avatar: foundUser.avatar,
            phoneNo: foundUser.phoneNo,
            role: foundUser.role,
            rollNo: foundUser.rollNo,
            section: foundUser.section,
            session: foundUser.session,
            createdAt: foundUser.createdAt,
            updatedAt: foundUser.updatedAt,
          };
          res.send({
            status: 202,
            message: 'Login Successful',
            'user-info': {
              id: foundUser._id,
              name: foundUser.name,
              email: foundUser.email,
              avatar: foundUser.avatar,
              phoneNo: foundUser.phoneNo,
              role: foundUser.role,
              rollNo: foundUser.rollNo,
              section: foundUser.section,
              session: foundUser.session,
              createdAt: foundUser.createdAt,
              updatedAt: foundUser.updatedAt,
            },
          });
        } else {
          console.error(e);
          const error = new HttpError("Passwords Don't Match", 404, 'password');
          return next(error);
        }
      });
    } else {
      console.error(err);
      const error = new HttpError('Invalid Email', 404, 'email');
      return next(error);
    }
  } catch (err) {
    console.error(err);
    const error = new HttpError('Something went wrong', 500, 'server');
    return next(error);
  }
};

// ---------------------------------------------------

module.exports = {
  login,
  registerStudent,
  checkAuth,
};
