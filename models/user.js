var mongoose = require('mongoose')
var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
var Review = require('./review')
var Gym = require('./gym')

var gymUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },
  name: {
    type: String,
    required: true,
    minlength: [3, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters']

  },
  isUser: Boolean,
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  gym: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym'
    }
  ]

})

var bcrypt = require('bcryptjs')
gymUserSchema.pre('save', function (next) {
  var gymUser = this
  console.log('about TO SAVE user', gymUser)
  // hash the password
  var hash = bcrypt.hashSync(gymUser.password, 10)
  console.log('orginal password', gymUser.password)
  console.log('hashed password', hash)
  gymUser.password = hash
  next()
})

gymUserSchema.statics.findByEmail = function (givenEmail, next) {
  this.findOne({
    email: givenEmail
  }, function (err, foundUser) {
    if (err) return 'user not found'

    next(null, foundUser)
  })
}

gymUserSchema.methods.validPassword = function (givenPassword) {
  var hashedpassword = this.password
  return bcrypt.compareSync(givenPassword, hashedpassword)
}

var GymUser = mongoose.model('GymUser', gymUserSchema)

module.exports = GymUser
