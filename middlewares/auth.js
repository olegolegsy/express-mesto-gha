const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(UnauthorizedError('Авторизуйся'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'mesto');
  } catch (err) {
    next(UnauthorizedError('Авторизуйся'));
  }

  req.user = payload;
  next();
};
