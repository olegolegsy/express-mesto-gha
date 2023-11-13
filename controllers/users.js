const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const notFoundError = 'NotFound';

// ====

// get 500
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      next(err);
    });
};

// get 404 500
const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new Error(notFoundError))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err.message);
      if (err.message === notFoundError) {
        next(new NotFoundError('Пользователь по такому _id не найден'));
      } else {
        next(err);
      }
    });
};

// post 400 500
const addNewUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже есть'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError({ message: err.message }));
      } else {
        next(err);
      }
    });
};

// patch 400 404 500
const editUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(new Error(notFoundError))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError({ message: err.message }));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по такому _id не найден'));
      } else {
        next(err);
      }
    });
};

// patch 400 404 500
const editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: 'true', runValidators: true }
  )
    .orFail(new Error(notFoundError))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError({ message: err.message }));
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь по такому _id не найден'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'mesto', {
        expiresIn: '7d',
      });
      res.status(200).send({ token });
    })
    .catch((err) => next(err));
};

const getYourself = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  addNewUser,
  editUserInfo,
  editUserAvatar,
  getYourself,
  login,
};
