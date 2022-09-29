const Card = require('../models/card');

const ERROR_400 = 400;
const ERROR_404 = 404;
const ERROR_500 = 500;

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => res.status(ERROR_500).send({ message: err.message }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(ERROR_500).send({ message: err.message });
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена.' });
      }
      if (!card.owner.equals(req.user._id)) {
        res.status(403).send({ message: 'Недостаточно прав.' });
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then((result) => {
          if (!result) {
            res.status(ERROR_404).send({ message: 'Карточка не найдена.' });
            return;
          }
          res.send({ data: card });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            res.status(ERROR_400).send({ message: 'Переданы некорректные данные.' });
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_404).send({ message: 'Карточка не найдена.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(ERROR_500).send({ message: err.message });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_404).send({ message: 'Карточка не найдена.' });
        return;
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: 'Переданы некорректные данные.' });
        return;
      }
      res.status(ERROR_500).send({ message: err.message });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
