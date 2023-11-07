const User = require('../models/user');

const ERROR_500 = 500;
const ERROR_404 = 404;
const ERROR_400 = 400;

const validError = 'ValidationError';
const castError = 'CastError';
const notFoundError = 'NotFound';

const handelError500 = (res) => {
  res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
};

const handelError404 = (res) => {
  res
    .status(ERROR_404)
    .send({ message: 'Пользователь по такому _id не найден' });
};

const handelError400 = (res, err) => {
  res.status(ERROR_400).send({ message: err.message });
};

// ====

// get 500
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      handelError500(res);
    });
};

// get 404 500
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error(notFoundError))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.message === notFoundError) {
        handelError404(res);
      } else {
        handelError500(res);
      }
    });
};

// async function getUserById(req, res) {
//   try {
//     const user = await User.findById(req.params.userId).orFail(
//       new Error('NotFound')
//     );
//     res.send(user);
//   } catch (err) {
//     if (err.message === 'NotFound') {
//       handelError404(res);
//     } else {
//       handelError500(res);
//     }
//   }
// }

// post 400 500
const addNewUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === validError) {
        handelError400(res);
      } else {
        handelError500(res);
      }
    });
};

// patch 400 404 500
const editUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new Error(notFoundError))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === castError) {
        handelError400(res);
      } else if (err.message === notFoundError) {
        handelError404(res);
      } else {
        handelError500(res);
      }
    });
};

// patch 400 404 500
const editUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: 'true', runValidators: true }
  )
    .orFail(new Error(notFoundError))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === castError) {
        handelError400(res);
      } else if (err.message === notFoundError) {
        handelError404(res);
      } else {
        handelError500(res);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  addNewUser,
  editUserInfo,
  editUserAvatar,
};
