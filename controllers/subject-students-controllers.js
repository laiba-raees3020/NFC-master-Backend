const Model = require('../models/subject-students-model');
const HttpError = require('../utils/HttpError');

const registerSubjectStudents = async (req, res, next) => {
  const { students, department, program, session, subject, semester } =
    req.body;
  const required = {
    students,
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

  const subjectStudents = Model({
    students,
    department,
    program,
    session,
    subject,
    semester,
  });

  try {
    await subjectStudents.save();
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
  registerSubjectStudents,
};
