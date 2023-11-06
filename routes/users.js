const router = require('express').Router();

const {
  getUsers,
  getUserById,
  addNewUser,
  editUserInfo,
  editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', addNewUser);
router.patch('/me', editUserInfo);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
