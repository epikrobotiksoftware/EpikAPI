const mongoose = require('mongoose');

const imageModel = mongoose.Schema({
  path: {
    type: String,
  },
  type: {
    type: String,
  },
  link: {
    type: String,
  },
  Date: Date,
});
Picture = mongoose.model('Picture', imageModel);
module.exports = Picture;
