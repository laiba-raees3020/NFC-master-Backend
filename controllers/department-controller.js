const Department = require('../models/department-model');
const HttpError = require('../utils/HttpError');

const registerDepartment = async (req, res, next) => {
  const { department_name, department_abbreviation, no_of_programs, lat, lng } =
    req.body;
  const required = {
    department_name,
    department_abbreviation,
    no_of_programs,
    lat,
    lng,
  };

  for (let val in required) {
    if (!required[val]) {
      const error = new HttpError(`${val} is required!`, 404, `${val}`);
      return next(error);
    }
  }

  const department = Department({
    department_name,
    department_abbreviation,
    no_of_programs,
    location: {
      lat,
      lng,
    },
  });

  try {
    await department.save();
    res.send({
      statusCode: 202,
      message: 'Successfully Registered',
    });
  } catch (e) {
    const error = new HttpError('Something went wrong', 500, 'department');
    return next(error);
  }
};

module.exports = {
  registerDepartment,
};
