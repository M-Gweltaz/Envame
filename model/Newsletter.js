const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    min: 6,
    max: 255
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('newsletter', newsletterSchema);