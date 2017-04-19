var mongoose = require('mongoose')
var Review = require('./review')

var gymSchema = new mongoose.Schema({
  name: String,
  description: String,
  capcity: Number,
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]

})

var Gym = mongoose.model('Gym', gymSchema)

module.exports = Gym
