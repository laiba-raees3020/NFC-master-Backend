const Model = require('../models/session-model');
const HttpError = require('../utils/HttpError');

const registerSession = async (req, res, next) => {
  const {
    session_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
  } = req.body;
  const required = {
    session_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
  };

  for (let val in required) {
    if (!required[val]) {
      const error = new HttpError(`${val} is required!`, 404, `${val}`);
      return next(error);
    }
  }

  const session = Model({
    session_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
  });

  try {
    await session.save();
    res.send({
      statusCode: 202,
      message: 'Successfully Registered',
    });
  } catch (e) {
    console.error(e);
    const error = new HttpError('Something went wrong', 500, 'session');
    return next(error);
  }
};

module.exports = {
  registerSession,
};
