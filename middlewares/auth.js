const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError();
  }

  const token = authorization.replace('Bearer ', '');
  let playload;

  try {
    playload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedError();
  }

  req.user = playload;
  next();
  return null;
};
