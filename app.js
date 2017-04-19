var express = require('express')
var app = express()
var mongoose = require('mongoose')
var flash = require('connect-flash')
var bodyPaser = require('body-parser')
var ejsLayouts = require('express-ejs-layouts')
var methodOverride = require('method-override')

require('dotenv').config({ silent: true })
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)

if (process.env.NODE_ENV === 'gymcount') {
  mongoose.connect('mongodb://localhost/gymcount')
} else {
  mongoose.connect(process.env.MONGODB_URI)
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: process.env.MONGODB_URI })
}))

var passport = require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(flash())
app.use(require('morgan')('dev'))
app.set('view engine', 'ejs')
app.use(ejsLayouts)

app.use(bodyPaser.urlencoded({extended: false}))

app.use(express.static('public'))

// routing

app.get('/', function (req, res) {
  res.render('homepage')
})
app.get('/youarelogin', function (req, res) {
  if (!req.isAuthenticated()) {
    res.render('youarelogin')
  }
})

// =======
// auth route
// ===========
var authController = require('./controllers/auth')
app.use('/auth', require('./controllers/auth'))
app.use('/', authController)

app.get('/logout', function (req, res) {
  req.logout()
  console.log('logged out')
  res.redirect('/')
})
function loggedIn (req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect('/login')
  }
}

// =========
// gym route
// ==========

var gymController = require('./controllers/gymControl')
// app.use('/gym', loggedIn, require('./controllers/gymControl'))
app.use('/',loggedIn, gymController)

// ============
// reviews route
// =============
app.get('/gym/:id/reviews/new', function (req, res) {

})

// ============
// server
// ==========

var server

if (process.env.NODE_ENV === 'gymcount') {
  server = app.listen(process.env.PORT || 4000)
} else {
  server = app.listen(process.env.PORT || 3000)
}

module.exports = server
