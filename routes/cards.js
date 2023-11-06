const router = require('express').Router();

const {
  getCards,
  delCard,
  addNewCard,
  addLike,
  removeLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', delCard);
router.post('/', addNewCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
