const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = 3000;
const DB_URL = 'mongodb://127.0.0.1:27017/mestodb';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use((req, res, next) => {
  req.user = { _id: '654571d170f678689b1900d0' };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT);
