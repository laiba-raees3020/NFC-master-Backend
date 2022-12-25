require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const authRoutes = require('./routes/auth-routes');
const departmentRoutes = require('./routes/department-routes');
const programRoutes = require('./routes/program-routes');
const sessionRoutes = require('./routes/session-routes');
const semesterRoutes = require('./routes/semester-routes');
const subjectRoutes = require('./routes/subject-routes');
const subjectStudentsRoutes = require('./routes/subject-students-routes');
const subjectTeachersRoutes = require('./routes/subject-teachers-routes');
const RouteMessage = require('./utils/RouteMessage');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

class ExpressApp {
  constructor() {
    const store = new MongoDBSession({
      uri: process.env.MONGODB_KEY,
      collection: 'authSessions',
    });
    this.app = express();
    this.app.use(express.json());
    this.app.use(
      cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
      })
    );
    this.app.use(cookieParser());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
          maxAge: 60 * 60 * 24,
          sameSite: 'none',
          httpOnly: true,
          secure: true,
        },
      })
    );
  }

  registerRoutes() {
    //? === Authentication ===
    this.app.use(authRoutes);

    //? === Department ===
    this.app.use(departmentRoutes);

    //? === Program ===
    this.app.use(programRoutes);

    //? === Session ===
    this.app.use(sessionRoutes);

    //? === Semester ===
    this.app.use(semesterRoutes);

    //? === Subject ===
    this.app.use(subjectRoutes);

    //? === Subject Students ===
    this.app.use(subjectStudentsRoutes);

    //? === Subject Teachers ===
    this.app.use(subjectTeachersRoutes);

    //?=== API Instruction Page ===
    this.app.get('/', (req, res) =>
      res.sendFile(__dirname + '/views/index.html')
    );

    new RouteMessage('GET', '/');
    new RouteMessage('POST', '/api/student/register');
    new RouteMessage('POST', '/api/login');
    // new RouteMessage('GET', '/api/departments');
    new RouteMessage('POST', '/api/departments');
    new RouteMessage('POST', '/api/programs');
    new RouteMessage('POST', '/api/sessions');
    new RouteMessage('POST', '/api/semesters');
    new RouteMessage('POST', '/api/subjects');
    new RouteMessage('POST', '/api/subject-students');
    new RouteMessage('POST', '/api/subject-teachers');
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
        this.app.listen(port, () => console.log(`Running On Port: ${port}`));
      })
      .catch((err) => console.error(err));

    //------------------------------------------------------------
  }
}

module.exports = {
  ExpressApp,
};
