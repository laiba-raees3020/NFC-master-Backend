require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth-routes');
const departmentRoutes = require('./routes/department-routes');
const programRoutes = require('./routes/program-routes');
const RouteMessage = require('./utils/RouteMessage');

class ExpressApp {
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  registerRoutes() {
    this.app.get('/', (req, res, next) => {
      res.send({ message: 'Hello NFC Master Backend' });
    });
    //? === Authentication ===
    this.app.use(authRoutes);

    //? === Department ===
    this.app.use(departmentRoutes);

    //? === Program ===
    this.app.use(programRoutes);

    new RouteMessage('GET', '/');
    new RouteMessage('POST', '/api/student/register');
    new RouteMessage('POST', '/api/login');
    // new RouteMessage('GET', '/api/departments');
    new RouteMessage('POST', '/api/departments');
    new RouteMessage('POST', '/api/programs');
  }

  runApp() {
    this.registerRoutes();
    //? === Database Connection ===
    mongoose
      .connect(process.env.MONGODB_KEY)
      .then(() => {
        let port;
        if (process.env.PORT) port = process.env.PORT;
        else port = 6000;
        this.app.listen(port, () => {
          console.log(`Running On Port: ${port}`);
        });
      })
      .catch((err) => {
        console.error(err);
      });

    //------------------------------------------------------------
  }
}

module.exports = {
  ExpressApp,
};
