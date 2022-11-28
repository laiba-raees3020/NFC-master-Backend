const Model = require('../models/semester-model');
const HttpError = require('../utils/HttpError');

const registerSemester = async (req, res, next) => {
  const {
    semester_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
    session,
  } = req.body;
  const required = {
    semester_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
    session,
  };

  for (let val in required) {
    if (!required[val]) {
      const error = new HttpError(`${val} is required!`, 404, `${val}`);
      return next(error);
    }
  }

  const semester = Model({
    semester_title,
    type,
    starting_year,
    ending_year,
    department,
    program,
    session,
  });

  try {
    await semester.save();
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
  registerSemester,
};
