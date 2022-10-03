const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.listen(6000 || process.env.PORT, () => {
  console.log('Running On Port: 6000');
});
