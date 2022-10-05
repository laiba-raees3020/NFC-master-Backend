require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth-routes');

const app = express();

app.get('/', (req, res, next) => {
  res.send({ message: 'Hello NFC Master Backend' });
});

app.use(express.json());
app.use(cors());

//? === Authentication ===

app.use(authRoutes);

//? === Database Connection ===

mongoose
  .connect(process.env.MONGODB_KEY)
  .then(() => {
    app.listen(6000 || process.env.PORT, () => {
      console.log('Running On Port: 6000');
    });
  })
  .catch((err) => {
    console.error(err);
  });

//------------------------------------------------------------
