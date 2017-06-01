var mongoose = require('mongoose')
var Gym = require('./gym')
var customerSchema = new mongoose.Schema({
  name: String,
  address: String,
  rfid: String,
  gym: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gym'
  }
})

var Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer
