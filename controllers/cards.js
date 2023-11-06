const Card = require('../models/card');

const ERROR_500 = 500;
const ERROR_404 = 404;
const ERROR_400 = 400;

const validError = 'ValidationError';

const handelError500 = (res) => {
  res.status(ERROR_500).send({ message: 'На сервере произошла ошибка' });
};

const handelError404 = (res) => {
  res.status(ERROR_404).send({ message: 'Карточки по _id не нашли' });
};

const handelError400 = (res) => {
  res.status(ERROR_400).send({ message: 'Некорректный _id карточки' });
};

const getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => handelError500(res));
};

const addNewCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.send(data))
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

const delCard = (req, res) => {
  const id = req.params.cardId;
  if (id.length === 24) {
    Card.findByIdAndRemove(id)
      .then((card) => {
        if (!card) {
          handelError404(res);
        } else {
          res.send({ message: 'Карточка удалена' });
        }
      })
      .catch(() => handelError404(res));
  } else {
    handelError400(res);
  }
};

const addLike = (req, res) => {
  const id = req.params.cardId;
  if (id.length === 24) {
    Card.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          handelError404(res);
        } else {
          res.send(card);
        }
      })
      .catch(() => handelError404(res));
  } else {
    handelError400(res);
  }
};

const removeLike = (req, res) => {
  const id = req.params.cardId;
  if (id.length === 24) {
    Card.findByIdAndUpdate(
      id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          handelError404(res);
        } else {
          res.send(card);
        }
      })
      .catch(() => handelError404(res));
  } else {
    handelError400(res);
  }
};

module.exports = {
  getCards,
  delCard,
  addNewCard,
  addLike,
  removeLike,
};
