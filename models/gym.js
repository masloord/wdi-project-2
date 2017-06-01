var mongoose = require('mongoose')
var Review = require('./review')
var User = require('./user')
var Customer = require('./customer')

var gymSchema = new mongoose.Schema({
  name: String,
  description: String,
  capcity: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  customer:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Customer'
  }
]

})

var Gym = mongoose.model('Gym', gymSchema)

module.exports = Gym
