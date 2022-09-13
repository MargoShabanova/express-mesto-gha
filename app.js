const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use('/users', routerUsers);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
