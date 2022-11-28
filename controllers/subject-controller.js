const Model = require('../models/subject-model');
const HttpError = require('../utils/HttpError');

const registerSubject = async (req, res, next) => {
  const {
    subject_title,
    type,
    subject_code,
    theory_hours,
    lab_hours,
    department,
    program,
    session,
    semester,
  } = req.body;
  const required = {
    subject_title,
    type,
    subject_code,
    theory_hours,
    lab_hours,
    department,
    program,
    session,
    semester,
  };

  for (let val in required) {
    if (!required[val]) {
      const error = new HttpError(`${val} is required!`, 404, `${val}`);
      return next(error);
    }
  }

  const subject = Model({
    subject_title,
    type,
    subject_code,
    theory_hours,
    lab_hours,
    department,
    program,
    session,
    semester,
  });

  try {
    await subject.save();
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
  registerSubject,
};
