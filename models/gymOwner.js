var mongoose = require('mongoose')

var gymOwnerSchema = new mongoose.Schema({
  username: String,
  password: String,
  gym: [] // referencing

})

var GymOwner = mongoose.model('GymOwner', gymOwnerSchema)

module.exports = GymOwner
