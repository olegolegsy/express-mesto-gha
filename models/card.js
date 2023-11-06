const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Заполните имя карточки'],
      minlenght: [2, 'Минимальная длинна - 2'],
      maxlength: [30, 'Максимальная длинна - 30'],
    },
    link: {
      type: String,
      required: [true, 'Добавьте ссылку на картинку'],
      validate: {
        validator(v) {
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
            v,
          );
        },
        message: 'Введите URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', default: [] }],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },

  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
