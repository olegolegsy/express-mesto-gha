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
  req.user = { _id: '65498f44675bb4a4413f21f4' };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.listen(PORT);

// если объект не найдет, то вернется код ответа 500
// нужно добавлять тест сообщения и по нему обрабатывать ошибку
// в блоке catch

// имя ошибки NotFound, код статуса 404, кастомная через orFail
// ключ 24 символа, как и ожидается, но такого юзера или карточки просто нет в базе

// ошибка CastError возникает когда переданные данные отличаются от
// ожидаемых в схеме (валидация) (например, ключ 24 символа, а мы передали 23 или 25)
// имя ошибки CastError, код доступа 400

//65498f44675bb4a4413f21f4
