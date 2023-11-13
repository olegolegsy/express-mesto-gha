const mongoose = require('mongoose');
const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const notFoundError = 'NotFound';

// get 500
const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

// post 400 500
const addNewCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .orFail(new Error(notFoundError))
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch(() => next(new NotFoundError('Карточки по _id не нашли')));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError({ message: err.message }));
      } else {
        next(err);
      }
    });
};

// delete 404 500
const delCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .orFail(new Error(notFoundError))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError('Вы не можете удалить чужую карточку');
      } else {
        Card.deleteOne(cardId)
          .orFail(new Error(notFoundError))
          .then(() => {
            res.status(200).send({ message: 'Карточка удалена' });
          })
          .catch((err) => {
            if (err.message === notFoundError) {
              next(new NotFoundError('Карточки по _id не нашли'));
            } else if (err instanceof mongoose.Error.ValidationError) {
              next(new BadRequestError('Некорректный _id карточки'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        next(new NotFoundError('Карточки по _id не нашли'));
      } else {
        next(err);
      }
    });
};

// 400 404 500
const addLike = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error(notFoundError))
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === notFoundError) {
        next(new NotFoundError('Карточки по _id не нашли'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректный _id карточки'));
      } else {
        next(err);
      }
    });
};

// 400 404 500
const removeLike = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error(notFoundError))
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.message === notFoundError) {
        next(new NotFoundError('Карточки по _id не нашли'));
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректный _id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  delCard,
  addNewCard,
  addLike,
  removeLike,
};
