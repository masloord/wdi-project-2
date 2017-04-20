var mongoose = require('mongoose')
var User = require('./user')

var reviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  description: String,
  rating: {
    required: true,
    type: Number,
    min: 0,
    max: 5
  },
  chiobuIndex: {
    required: true,
    type: Number,
    min: 0,
    max: 5
  },
  hunkIndex: {
    required: true,
    type: Number,
    min: 0,
    max: 5
  }

})
var Review = mongoose.model('Review', reviewSchema)

module.exports = Review
