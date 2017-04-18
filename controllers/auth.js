var express = require('express')
var router = express.Router()
var passport = require('../config/passport')
var User = require('../models/user')

// User Auth
router.route('/register')
.get(function (req, res) {
  res.render('auth/signup', {
  })
})
.post(passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/login'
}))


router.route('/login')
.get(function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/youarelogin')
  }
  res.render('auth/login')
})
.post(function (req, res) {
  User.findByEmail(req.body.email, function (err, foundUser) {
    if (err) return res.send(err)
    if (!foundUser) {
      console.log('no user')
      return res.redirect('/login')
    }
    var givenPassword = req.body.password
    if (foundUser.validPassword(givenPassword)) {
      console.log('correct password')
      res.redirect('/')
    } else {
      console.log('wrong password')
      res.redirect('/login')
    }
  })
})

module.exports = router
