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
      req.flash('error', 'Registration failed')
      return next(err)
    }
    next(null, data)
  })
}))

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  // passReqToCallback: true
}, function (givenEmail, givenPassword, next) {
  User.findByEmail(givenEmail, function (err, foundUser) {
    if (err) return next(err)
    if (!foundUser) {
      console.log('no user')
      next(null, false)
    }
    // var givenPassword = givenPassword
    if (foundUser.validPassword(givenPassword)) {
      console.log('correct password')
      return next(null, foundUser)
    } else {
      console.log('wrong password')
      return next(null, false)
    }
  })
}))

module.exports = passport
