var mongoose = require('mongoose')

var reviewSchema = new mongoose.Schema({
  title: String,
  description: String,
  rating: Number

})
var Review = mongoose.model('Review', reviewSchema)

module.exports = Review
