const Model = require('../models/subject-teachers-model');
const HttpError = require('../utils/HttpError');

const registerSubjectTeachers = async (req, res, next) => {
  const { teachers, department, program, session, subject, semester } =
    req.body;
  const required = {
    teachers,
    department,
    program,
    session,
    subject,
    semester,
  };

  for (let val in required) {
    if (!required[val]) {
      const error = new HttpError(`${val} is required!`, 404, `${val}`);
      return next(error);
    }
  }

  const subjectTeachers = Model({
    teachers,
    department,
    program,
    session,
    subject,
    semester,
  });

  try {
    await subjectTeachers.save();
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
  registerSubjectTeachers,
};
