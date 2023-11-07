const Card = require('../models/card');

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
  res.status(ERROR_404).send({ message: 'Карточки по _id не нашли' });
};

const handelError400 = (res) => {
  res.status(ERROR_400).send({ message: 'Некорректный _id карточки' });
};

// get 500
const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => handelError500(res));
};

// post 400 500
const addNewCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch(() => handelError404(res));
    })
    .catch((err) => {
      if (err.name === validError) {
        res.status(ERROR_400).send({ message: err.message });
      } else {
        handelError500(res);
      }
    });
};

// delete 404 500
const delCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .orFail(new Error(notFoundError))
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.message === notFoundError) {
        handelError404(res);
      } else {
        handelError500(res);
      }
    });
};

// 400 404 500
const addLike = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error(notFoundError))
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === notFoundError) {
        handelError404(res);
      } else if (err.name === castError) {
        handelError400(res);
      } else {
        handelError500(res);
      }
    });
};

// 400 404 500
const removeLike = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error(notFoundError))
    .populate(['owner', 'likes'])
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === notFoundError) {
        handelError404(res);
      } else if (err.name === castError) {
        handelError400(res);
      } else {
        handelError500(res);
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
