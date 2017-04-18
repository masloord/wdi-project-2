var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('../models/user')

passport.serializeUser(function (user, done) {
  done(null, user.id)
})
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, givenEmail, givenPassword, next) {
  console.log(req.body)
  var newUser = new User({
    email: givenEmail,
    name: req.body.name,
    password: givenPassword,
    isUser: req.body.isUser
  })
  newUser.save(function (err, data) {
    if (err) {
      return next(err)
    }
    next(null, data)
  })
}))

module.exports = passport
