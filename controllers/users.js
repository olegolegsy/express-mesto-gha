const User = require('../models/user');

const ERROR_500 = 500;
const ERROR_404 = 404;
const ERROR_400 = 400;

const validError = 'ValidationError';

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

// get
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      handelError500(res);
    });
};

// get

// очень много 404, надо подумать над оптимизацией
const getUserById = (req, res) => {
  // подумать над дополнительной проверкой (является ли ключ)
  if (req.params.userId.length === 24) {
    // деструктрурировать req.body.
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          // повторяется проверка на 404
          handelError404(res);
        } else {
          res.send(user);
        }
      })
      .catch(() => {
        // повторяется проверка на 404
        handelError404(res);
      });
  } else {
    // повторяется проверка на 404
    handelError404(res);
  }
};

// post
const addNewUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === validError) {
        handelError400(res, err);
      } else {
        handelError500(res);
      }
    });
};

// patch
const editUserInfo = (req, res) => {
  const { name, about } = req.body;

  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      // проверить свойство new, почему строка, а не Boolean
      { new: true, runValidators: true },
    )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === validError) {
          handelError400(res, err);
        } else {
          handelError404(res);
        }
      });
  } else {
    handelError500(res);
  }
};

// patch
const editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: 'true', runValidators: true },
    )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === validError) {
          handelError400(res, err);
        } else {
          handelError404(res);
        }
      });
  } else {
    handelError500(res);
  }
};

module.exports = {
  getUsers,
  getUserById,
  addNewUser,
  editUserInfo,
  editUserAvatar,
};
