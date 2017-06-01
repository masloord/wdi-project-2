var express = require('express')
var app = express()
var mongoose = require('mongoose')
var flash = require('connect-flash')
var bodyPaser = require('body-parser')
var ejsLayouts = require('express-ejs-layouts')
var methodOverride = require('method-override')
const path = require('path')
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

app.use(express.static(path.join(__dirname, 'public')))

// passing flash into route
app.use(function (req, res, next) {
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next()
})

// routing

app.get('/', function (req, res) {
  res.render('homepage')
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
  req.flash('success', 'You have successfully logged out')
  res.redirect('/')
})
function loggedIn (req, res, next) {
  if (req.user) {
    next()
  } else {
    req.flash('error', 'Please sign in')
    res.redirect('/login')
  }
}

// =========
// gym route
// ==========

var gymController = require('./controllers/gymControl')
app.use('/', gymController)

// ============
// reviews route
// =============
var reviewController = require('./controllers/review_controller')
app.use('/', loggedIn, reviewController)
// ============
// customers route
// =============
var customerController = require('./controllers/customer_controller')
app.use('/', loggedIn, customerController)
// ============
// server
// ==========
var server = require('http').Server(app)
var io = require('socket.io')(server)
var mqtt = require('mqtt')
var options = {
  port: 18490,
  host: 'mqtt://m10.cloudmqtt.com',
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: 'oanyjkay',
  password: 'Y1vUm-bItNPi',
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  clean: true,
  encoding: 'utf8',
  useSSL: true
}

var client = mqtt.connect('mqtt://m10.cloudmqtt.com', options)

client.on('connect', function () { // When connected
  console.log('connected')
    // subscribe to a topic
  client.subscribe('topic1/#', function () {
        // when a message arrives, do something with it
    client.on('message', function (topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'")

      var data = message.toString('utf8')
      console.log(data)
      io.emit('rfid', data)
    })
  })
})

io.on('connection', function (socket) {
  console.log('a user connected')
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})


if (process.env.NODE_ENV === 'gymcount') {
  server.listen(process.env.PORT || 3000, function () {
    console.log('listening on *:3000')
  })
} else {
  server.listen(process.env.PORT || 4000, function () {
    console.log('listening on *:4000')
  })
}

module.exports = server
