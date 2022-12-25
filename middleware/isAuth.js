const HttpError = require('../utils/HttpError');

module.exports = {
  isAuth: (req, res, next) => {
    if (!req.session.isAuth) {
      const error = new HttpError('Access Denied', 403, 'Unauthorized');
      next(error);
    }
  },
};

// req.session.destroy(err=>{
//     if(err) throw err;

// })
