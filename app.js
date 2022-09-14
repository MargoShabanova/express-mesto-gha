const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.use((req, res, next) => {
  req.user = {
    _id: '6320e1d6ceab5b2b307c081a',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
