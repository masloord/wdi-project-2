var mongoose = require('mongoose')

var gymSchema = new mongoose.Schema({
  name:String,
  description:String,
  capcity:Number,
  review:[]

})

var Gym = mongoose.model('Gym', gymSchema)

module.exports = Gym
