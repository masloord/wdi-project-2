var express = require('express')
var router = express.Router()
var passport = require('../config/passport')
var User = require('../models/user')

// User Auth
router.route('/register')
.get(function (req, res) {
  if (req.isAuthenticated()) {
    req.flash('error', 'user alr logged in')
    res.redirect('/')
  }
  res.render('auth/signup')
})
.post(passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/auth/register'
}))

router.route('/login')
.get(function (req, res) {
  if (req.isAuthenticated()) {
    req.flash('error', 'You have logged in')
    return res.redirect('/')
  }
  res.render('auth/login')
})
.post(
  passport.authenticate('local-login', {
    successRedirect: '/gym/user',
    failureRedirect: '/auth/login'
  })
)

module.exports = router
