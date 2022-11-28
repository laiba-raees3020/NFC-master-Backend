const Model = require('../models/program-model');
const HttpError = require('../utils/HttpError');

const registerProgram = async (req, res, next) => {
  const { program_title, type, starting, ending, department } = req.body;
  const required = { program_title, type, starting, ending, department };

  for (let val in required) {
    if (!required[val]) {
      const error = new HttpError(`${val} is required!`, 404, `${val}`);
      return next(error);
    }
  }

  const program = Model({ program_title, type, starting, ending, department });

  try {
    await program.save();
    res.send({
      statusCode: 202,
      message: 'Successfully Registered',
    });
  } catch (e) {
    console.error(e);
    const error = new HttpError('Something went wrong', 500, 'department');
    return next(error);
  }
};

module.exports = {
  registerProgram,
};
