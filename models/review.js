var mongoose = require('mongoose')

var reviewSchema = new mongoose.Schema({
  title: String,
  description: String,
  rating: Number

})
var Review = mongoose.model('review', reviewSchema)

module.exports = Review
